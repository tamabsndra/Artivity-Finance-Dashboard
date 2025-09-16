import { apiClient } from './base'
import { API_ENDPOINTS } from './endpoints'
import {
    Transaction,
    CreateRequest,
    UpdateRequest,
    DeleteRequest,
    QueryParams,
    BulkCreateRequest,
    BulkUpdateRequest,
    BulkDeleteRequest,
    DateRangeFilter
} from '@/types/api'
import { PaginatedResponse } from '@/types/api'

export interface TransactionSummary {
    total_income: number
    total_expense: number
    net_income: number
    transaction_count: number
    period: string
}

export interface TransactionFilters extends QueryParams {
    type?: 'income' | 'expense'
    method?: 'sales' | 'capex' | 'opex'
    category_id?: number
    project_id?: number
    tag_id?: number
    date_range?: DateRangeFilter
}

export class TransactionService {
    // Get all transactions with pagination and filters
    async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
        const response = await apiClient.get<PaginatedResponse<Transaction>>(
            API_ENDPOINTS.TRANSACTIONS.LIST,
            filters
        )
        return response.data
    }

    // Get single transaction by ID
    async getTransaction(id: number): Promise<Transaction> {
        const response = await apiClient.get<Transaction>(
            API_ENDPOINTS.TRANSACTIONS.GET(id)
        )
        return response.data
    }

    // Create new transaction
    async createTransaction(data: CreateRequest<Transaction>): Promise<Transaction> {
        const response = await apiClient.post<Transaction>(
            API_ENDPOINTS.TRANSACTIONS.CREATE,
            data
        )
        return response.data
    }

    // Update existing transaction
    async updateTransaction(data: UpdateRequest<Transaction>): Promise<Transaction> {
        const response = await apiClient.put<Transaction>(
            API_ENDPOINTS.TRANSACTIONS.UPDATE(data.id),
            data.data
        )
        return response.data
    }

    // Delete transaction
    async deleteTransaction(data: DeleteRequest): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.TRANSACTIONS.DELETE(data.id))
    }

    // Bulk create transactions
    async bulkCreateTransactions(data: BulkCreateRequest<Transaction>): Promise<Transaction[]> {
        const response = await apiClient.post<Transaction[]>(
            API_ENDPOINTS.TRANSACTIONS.BULK_CREATE,
            data
        )
        return response.data
    }

    // Bulk update transactions
    async bulkUpdateTransactions(data: BulkUpdateRequest<Transaction>): Promise<Transaction[]> {
        const response = await apiClient.put<Transaction[]>(
            API_ENDPOINTS.TRANSACTIONS.BULK_UPDATE,
            data
        )
        return response.data
    }

    // Bulk delete transactions
    async bulkDeleteTransactions(data: BulkDeleteRequest): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.TRANSACTIONS.BULK_DELETE, {
            body: data
        })
    }

    // Get transaction summary
    async getTransactionSummary(filters?: TransactionFilters): Promise<TransactionSummary> {
        const response = await apiClient.get<TransactionSummary>(
            API_ENDPOINTS.TRANSACTIONS.SUMMARY,
            filters
        )
        return response.data
    }

    // Export transactions
    async exportTransactions(filters?: TransactionFilters, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
        const response = await fetch(
            `${apiClient.baseURL}/${API_ENDPOINTS.TRANSACTIONS.EXPORT}?format=${format}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            }
        )
        return response.blob()
    }
}

// Export singleton instance
export const transactionService = new TransactionService()
