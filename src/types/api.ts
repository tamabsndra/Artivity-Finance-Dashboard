// API Response Types
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    errors?: string[]
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ApiError {
    code: string
    message: string
    details?: Record<string, any>
}

// Request Types
export interface CreateRequest<T> {
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
}

export interface UpdateRequest<T> {
    id: number
    data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
}

export interface DeleteRequest {
    id: number
}

export interface QueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    filters?: Record<string, any>
}

// Date Range Filter
export interface DateRangeFilter {
    start_date: string
    end_date: string
}

// Bulk Operations
export interface BulkCreateRequest<T> {
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>[]
}

export interface BulkUpdateRequest<T> {
    updates: Array<{
        id: number
        data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
    }>
}

export interface BulkDeleteRequest {
    ids: number[]
}
