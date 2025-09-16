import { BaseApiService } from './base'
import { API_ENDPOINTS } from './endpoints'
import type { Employee, SalaryHistory } from '@/types/financial'
import type { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/api'

export class EmployeeService extends BaseApiService {
    /**
     * Get all employees with pagination and filtering
     */
    async getEmployees(params?: PaginationParams & {
        search?: string
        position?: string
        type?: 'full-time' | 'freelance' | 'contract'
    }): Promise<PaginatedResponse<Employee>> {
        return this.get<PaginatedResponse<Employee>>(API_ENDPOINTS.EMPLOYEES, { params })
    }

    /**
     * Get employee by ID
     */
    async getEmployeeById(id: number): Promise<ApiResponse<Employee>> {
        return this.get<ApiResponse<Employee>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`)
    }

    /**
     * Create new employee
     */
    async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Employee>> {
        return this.post<ApiResponse<Employee>>(API_ENDPOINTS.EMPLOYEES, employee)
    }

    /**
     * Update employee
     */
    async updateEmployee(id: number, employee: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Employee>> {
        return this.put<ApiResponse<Employee>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`, employee)
    }

    /**
     * Delete employee
     */
    async deleteEmployee(id: number): Promise<ApiResponse<void>> {
        return this.delete<ApiResponse<void>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`)
    }

    /**
     * Get salary history for employee
     */
    async getSalaryHistory(employeeId: number): Promise<ApiResponse<SalaryHistory[]>> {
        return this.get<ApiResponse<SalaryHistory[]>>(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/salary-history`)
    }

    /**
     * Update employee salary
     */
    async updateSalary(employeeId: number, salaryData: {
        amount: number
        start_date: string
        end_date?: string
    }): Promise<ApiResponse<SalaryHistory>> {
        return this.post<ApiResponse<SalaryHistory>>(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/salary`, salaryData)
    }

    /**
     * Get employee positions
     */
    async getEmployeePositions(): Promise<ApiResponse<string[]>> {
        return this.get<ApiResponse<string[]>>(`${API_ENDPOINTS.EMPLOYEES}/positions`)
    }

    /**
     * Get employee summary statistics
     */
    async getEmployeeSummary(): Promise<ApiResponse<{
        total_employees: number
        total_monthly_payroll: number
        average_salary: number
        full_time_count: number
        freelance_count: number
        contract_count: number
        position_breakdown: Array<{ position: string; count: number; avg_salary: number }>
    }>> {
        return this.get<ApiResponse<{
            total_employees: number
            total_monthly_payroll: number
            average_salary: number
            full_time_count: number
            freelance_count: number
            contract_count: number
            position_breakdown: Array<{ position: string; count: number; avg_salary: number }>
        }>>(`${API_ENDPOINTS.EMPLOYEES}/summary`)
    }
}

export const employeeService = new EmployeeService()
