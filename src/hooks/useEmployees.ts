import { useState, useEffect, useCallback } from 'react'
import { employeeService } from '@/services/api/employeeService'
import type { Employee, SalaryHistory } from '@/types/entities'
import type { PaginationParams, PaginatedResponse } from '@/types/api'

interface EmployeeFilters extends PaginationParams {
    search?: string
    position?: string
    type?: 'full-time' | 'freelance' | 'contract'
}

interface EmployeeSummary {
    total_employees: number
    total_monthly_payroll: number
    average_salary: number
    full_time_count: number
    freelance_count: number
    contract_count: number
    position_breakdown: Array<{ position: string; count: number; avg_salary: number }>
}

export function useEmployees(filters: EmployeeFilters = { page: 1, limit: 10 }) {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginatedResponse<Employee>['pagination'] | null>(null)

    const fetchEmployees = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await employeeService.getEmployees(filters)
            setEmployees(response.data)
            setPagination(response.pagination)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch employees')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const response = await employeeService.createEmployee(employeeData)
            setEmployees(prev => [response.data, ...prev])
            return response.data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create employee')
            throw err
        }
    }, [])

    const updateEmployee = useCallback(async (id: number, employeeData: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>) => {
        try {
            const response = await employeeService.updateEmployee(id, employeeData)
            setEmployees(prev => prev.map(employee => employee.id === id ? response.data : employee))
            return response.data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update employee')
            throw err
        }
    }, [])

    const deleteEmployee = useCallback(async (id: number) => {
        try {
            await employeeService.deleteEmployee(id)
            setEmployees(prev => prev.filter(employee => employee.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete employee')
            throw err
        }
    }, [])

    const updateSalary = useCallback(async (employeeId: number, salaryData: {
        amount: number
        start_date: string
        end_date?: string
    }) => {
        try {
            const response = await employeeService.updateSalary(employeeId, salaryData)
            // Update employee's current salary
            setEmployees(prev => prev.map(employee =>
                employee.id === employeeId
                    ? { ...employee, current_salary: salaryData.amount }
                    : employee
            ))
            return response.data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update salary')
            throw err
        }
    }, [])

    return {
        employees,
        loading,
        error,
        pagination,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        updateSalary,
        refetch: fetchEmployees
    }
}

export function useEmployeeSummary() {
    const [summary, setSummary] = useState<EmployeeSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSummary = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await employeeService.getEmployeeSummary()
            setSummary(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch employee summary')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    return {
        summary,
        loading,
        error,
        refetch: fetchSummary
    }
}

export function useEmployeePositions() {
    const [positions, setPositions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPositions = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await employeeService.getEmployeePositions()
            setPositions(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch positions')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPositions()
    }, [fetchPositions])

    return {
        positions,
        loading,
        error,
        refetch: fetchPositions
    }
}

export function useSalaryHistory(employeeId: number) {
    const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSalaryHistory = useCallback(async () => {
        if (!employeeId) return

        setLoading(true)
        setError(null)
        try {
            const response = await employeeService.getSalaryHistory(employeeId)
            setSalaryHistory(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch salary history')
        } finally {
            setLoading(false)
        }
    }, [employeeId])

    useEffect(() => {
        fetchSalaryHistory()
    }, [fetchSalaryHistory])

    return {
        salaryHistory,
        loading,
        error,
        refetch: fetchSalaryHistory
    }
}
