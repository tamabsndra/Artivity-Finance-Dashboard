import {
    Transaction,
    CreateRequest,
    UpdateRequest,
    DeleteRequest,
    QueryParams,
    BulkCreateRequest,
    BulkUpdateRequest,
    BulkDeleteRequest,
    PaginatedResponse
} from '@/types/api'
import { mockTransactions, mockCategories, mockProjects, mockTags } from './mockData'

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
    date_range?: {
        start_date: string
        end_date: string
    }
}

export class MockTransactionService {
    private transactions: Transaction[] = [...mockTransactions]
    private nextId = mockTransactions.length + 1

    // Simulate API delay
    private delay(ms: number = 300): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Get all transactions with pagination and filters
    async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
        await this.delay()

        let filteredTransactions = [...this.transactions]

        // Apply filters
        if (filters) {
            if (filters.type) {
                filteredTransactions = filteredTransactions.filter(t => t.type === filters.type)
            }
            if (filters.method) {
                filteredTransactions = filteredTransactions.filter(t => t.method === filters.method)
            }
            if (filters.category_id) {
                filteredTransactions = filteredTransactions.filter(t => t.category_id === filters.category_id)
            }
            if (filters.project_id) {
                filteredTransactions = filteredTransactions.filter(t => t.project_id === filters.project_id)
            }
            if (filters.tag_id) {
                filteredTransactions = filteredTransactions.filter(t => t.tag_id === filters.tag_id)
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                filteredTransactions = filteredTransactions.filter(t =>
                    t.description.toLowerCase().includes(searchLower)
                )
            }
            if (filters.date_range) {
                filteredTransactions = filteredTransactions.filter(t =>
                    t.date >= filters.date_range!.start_date &&
                    t.date <= filters.date_range!.end_date
                )
            }
        }

        // Apply pagination
        const page = filters?.page || 1
        const limit = filters?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

        // Add relations
        const transactionsWithRelations = paginatedTransactions.map(transaction => ({
            ...transaction,
            category: mockCategories.find(c => c.id === transaction.category_id),
            project: transaction.project_id ? mockProjects.find(p => p.id === transaction.project_id) : undefined,
            tag: transaction.tag_id ? mockTags.find(t => t.id === transaction.tag_id) : undefined,
        }))

        return {
            data: transactionsWithRelations,
            pagination: {
                page,
                limit,
                total: filteredTransactions.length,
                totalPages: Math.ceil(filteredTransactions.length / limit)
            }
        }
    }

    // Get single transaction by ID
    async getTransaction(id: number): Promise<Transaction> {
        await this.delay()

        const transaction = this.transactions.find(t => t.id === id)
        if (!transaction) {
            throw new Error(`Transaction with id ${id} not found`)
        }

        return {
            ...transaction,
            category: mockCategories.find(c => c.id === transaction.category_id),
            project: transaction.project_id ? mockProjects.find(p => p.id === transaction.project_id) : undefined,
            tag: transaction.tag_id ? mockTags.find(t => t.id === transaction.tag_id) : undefined,
        }
    }

    // Create new transaction
    async createTransaction(data: CreateRequest<Transaction>): Promise<Transaction> {
        await this.delay()

        const newTransaction: Transaction = {
            id: this.nextId++,
            ...data.data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        this.transactions.push(newTransaction)

        return {
            ...newTransaction,
            category: mockCategories.find(c => c.id === newTransaction.category_id),
            project: newTransaction.project_id ? mockProjects.find(p => p.id === newTransaction.project_id) : undefined,
            tag: newTransaction.tag_id ? mockTags.find(t => t.id === newTransaction.tag_id) : undefined,
        }
    }

    // Update existing transaction
    async updateTransaction(data: UpdateRequest<Transaction>): Promise<Transaction> {
        await this.delay()

        const index = this.transactions.findIndex(t => t.id === data.id)
        if (index === -1) {
            throw new Error(`Transaction with id ${data.id} not found`)
        }

        this.transactions[index] = {
            ...this.transactions[index],
            ...data.data,
            updated_at: new Date().toISOString(),
        }

        return {
            ...this.transactions[index],
            category: mockCategories.find(c => c.id === this.transactions[index].category_id),
            project: this.transactions[index].project_id ? mockProjects.find(p => p.id === this.transactions[index].project_id) : undefined,
            tag: this.transactions[index].tag_id ? mockTags.find(t => t.id === this.transactions[index].tag_id) : undefined,
        }
    }

    // Delete transaction
    async deleteTransaction(data: DeleteRequest): Promise<void> {
        await this.delay()

        const index = this.transactions.findIndex(t => t.id === data.id)
        if (index === -1) {
            throw new Error(`Transaction with id ${data.id} not found`)
        }

        this.transactions.splice(index, 1)
    }

    // Bulk create transactions
    async bulkCreateTransactions(data: BulkCreateRequest<Transaction>): Promise<Transaction[]> {
        await this.delay()

        const newTransactions = data.data.map(transactionData => ({
            id: this.nextId++,
            ...transactionData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))

        this.transactions.push(...newTransactions)

        return newTransactions.map(transaction => ({
            ...transaction,
            category: mockCategories.find(c => c.id === transaction.category_id),
            project: transaction.project_id ? mockProjects.find(p => p.id === transaction.project_id) : undefined,
            tag: transaction.tag_id ? mockTags.find(t => t.id === transaction.tag_id) : undefined,
        }))
    }

    // Bulk update transactions
    async bulkUpdateTransactions(data: BulkUpdateRequest<Transaction>): Promise<Transaction[]> {
        await this.delay()

        const updatedTransactions: Transaction[] = []

        for (const update of data.updates) {
            const index = this.transactions.findIndex(t => t.id === update.id)
            if (index !== -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    ...update.data,
                    updated_at: new Date().toISOString(),
                }
                updatedTransactions.push(this.transactions[index])
            }
        }

        return updatedTransactions.map(transaction => ({
            ...transaction,
            category: mockCategories.find(c => c.id === transaction.category_id),
            project: transaction.project_id ? mockProjects.find(p => p.id === transaction.project_id) : undefined,
            tag: transaction.tag_id ? mockTags.find(t => t.id === transaction.tag_id) : undefined,
        }))
    }

    // Bulk delete transactions
    async bulkDeleteTransactions(data: BulkDeleteRequest): Promise<void> {
        await this.delay()

        this.transactions = this.transactions.filter(t => !data.ids.includes(t.id))
    }

    // Get transaction summary
    async getTransactionSummary(filters?: TransactionFilters): Promise<TransactionSummary> {
        await this.delay()

        let filteredTransactions = [...this.transactions]

        // Apply filters
        if (filters) {
            if (filters.type) {
                filteredTransactions = filteredTransactions.filter(t => t.type === filters.type)
            }
            if (filters.method) {
                filteredTransactions = filteredTransactions.filter(t => t.method === filters.method)
            }
            if (filters.category_id) {
                filteredTransactions = filteredTransactions.filter(t => t.category_id === filters.category_id)
            }
            if (filters.project_id) {
                filteredTransactions = filteredTransactions.filter(t => t.project_id === filters.project_id)
            }
            if (filters.tag_id) {
                filteredTransactions = filteredTransactions.filter(t => t.tag_id === filters.tag_id)
            }
            if (filters.date_range) {
                filteredTransactions = filteredTransactions.filter(t =>
                    t.date >= filters.date_range!.start_date &&
                    t.date <= filters.date_range!.end_date
                )
            }
        }

        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)

        const totalExpense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)

        return {
            total_income: totalIncome,
            total_expense: totalExpense,
            net_income: totalIncome - totalExpense,
            transaction_count: filteredTransactions.length,
            period: filters?.date_range ?
                `${filters.date_range.start_date} to ${filters.date_range.end_date}` :
                'All time'
        }
    }

    // Export transactions (mock)
    async exportTransactions(filters?: TransactionFilters, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
        await this.delay()

        // Mock export - return empty blob
        return new Blob(['Mock export data'], { type: 'text/csv' })
    }
}

// Export singleton instance
export const mockTransactionService = new MockTransactionService()
