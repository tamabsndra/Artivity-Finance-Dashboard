import { ApiResponse, ApiError, QueryParams } from '@/types/api'

// Base API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export const API_VERSION = 'v1'

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Request Configuration
export interface RequestConfig {
    method: HttpMethod
    headers?: Record<string, string>
    body?: any
    params?: QueryParams
}

// API Client Class
export class ApiClient {
    private baseURL: string
    private defaultHeaders: Record<string, string>

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    // Set authentication token
    setAuthToken(token: string) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    // Remove authentication token
    removeAuthToken() {
        delete this.defaultHeaders['Authorization']
    }

    // Build URL with query parameters
    private buildURL(endpoint: string, params?: QueryParams): string {
        const url = new URL(`${this.baseURL}/${API_VERSION}${endpoint}`)

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value))
                }
            })
        }

        return url.toString()
    }

    // Make HTTP request
    async request<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
        try {
            const url = this.buildURL(endpoint, config.params)

            const requestInit: RequestInit = {
                method: config.method,
                headers: {
                    ...this.defaultHeaders,
                    ...config.headers,
                },
            }

            if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
                requestInit.body = JSON.stringify(config.body)
            }

            const response = await fetch(url, requestInit)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new ApiError(
                    errorData.code || 'HTTP_ERROR',
                    errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                    errorData.details
                )
            }

            const data = await response.json()
            return {
                success: true,
                data,
                message: data.message,
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }

            throw new ApiError(
                'NETWORK_ERROR',
                error instanceof Error ? error.message : 'Unknown error occurred',
                { originalError: error }
            )
        }
    }

    // Convenience methods
    async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET', params })
    }

    async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'POST', body })
    }

    async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PUT', body })
    }

    async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PATCH', body })
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }
}

// Custom Error Class
export class ApiError extends Error {
    public code: string
    public details?: Record<string, any>

    constructor(code: string, message: string, details?: Record<string, any>) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.details = details
    }
}

// Default API client instance
export const apiClient = new ApiClient()
