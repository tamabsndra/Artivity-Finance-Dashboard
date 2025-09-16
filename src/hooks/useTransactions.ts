import { useState, useEffect, useCallback } from 'react'
import { Transaction, TransactionFilters, TransactionSummary } from '@/types/api'
import { PaginatedResponse } from '@/types/api'
import { mockTransactionService } from '@/services/mock/mockTransactionService'

interface UseTransactionsReturn {
    transactions: Transaction[]
    loading: boolean
    error: string | null
    pagination: PaginatedResponse<Transaction>['pagination'] | null
    refetch: () => Promise<void>
    createTransaction: (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
    updateTransaction: (id: number, data: Partial<Transaction>) => Promise<void>
    deleteTransaction: (id: number) => Promise<void>
    bulkDeleteTransactions: (ids: number[]) => Promise<void>
}

export function useTransactions(filters?: TransactionFilters): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginatedResponse<Transaction>['pagination'] | null>(null)

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await mockTransactionService.getTransactions(filters)
            setTransactions(response.data)
            setPagination(response.pagination)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
        } finally {
            setLoading(false)
        }
    }, [filters])

    const createTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setError(null)
            await mockTransactionService.createTransaction({ data })
            await fetchTransactions() // Refetch to get updated list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create transaction')
            throw err
        }
    }, [fetchTransactions])

    const updateTransaction = useCallback(async (id: number, data: Partial<Transaction>) => {
        try {
            setError(null)
            await mockTransactionService.updateTransaction({ id, data })
            await fetchTransactions() // Refetch to get updated list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update transaction')
            throw err
        }
    }, [fetchTransactions])

    const deleteTransaction = useCallback(async (id: number) => {
        try {
            setError(null)
            await mockTransactionService.deleteTransaction({ id })
            await fetchTransactions() // Refetch to get updated list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete transaction')
            throw err
        }
    }, [fetchTransactions])

    const bulkDeleteTransactions = useCallback(async (ids: number[]) => {
        try {
            setError(null)
            await mockTransactionService.bulkDeleteTransactions({ ids })
            await fetchTransactions() // Refetch to get updated list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete transactions')
            throw err
        }
    }, [fetchTransactions])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    return {
        transactions,
        loading,
        error,
        pagination,
        refetch: fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        bulkDeleteTransactions,
    }
}

interface UseTransactionSummaryReturn {
    summary: TransactionSummary | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useTransactionSummary(filters?: TransactionFilters): UseTransactionSummaryReturn {
    const [summary, setSummary] = useState<TransactionSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const summaryData = await mockTransactionService.getTransactionSummary(filters)
            setSummary(summaryData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch transaction summary')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    return {
        summary,
        loading,
        error,
        refetch: fetchSummary,
    }
}
