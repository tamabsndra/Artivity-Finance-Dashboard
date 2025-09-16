import { BaseApiService } from './base'
import { API_ENDPOINTS } from './endpoints'
import type { Asset } from '@/types/financial'
import type { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/api'

export class AssetService extends BaseApiService {
    /**
     * Get all assets with pagination and filtering
     */
    async getAssets(params?: PaginationParams & {
        search?: string
        category?: string
        min_value?: number
        max_value?: number
    }): Promise<PaginatedResponse<Asset>> {
        return this.get<PaginatedResponse<Asset>>(API_ENDPOINTS.ASSETS, { params })
    }

    /**
     * Get asset by ID
     */
    async getAssetById(id: number): Promise<ApiResponse<Asset>> {
        return this.get<ApiResponse<Asset>>(`${API_ENDPOINTS.ASSETS}/${id}`)
    }

    /**
     * Create new asset
     */
    async createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Asset>> {
        return this.post<ApiResponse<Asset>>(API_ENDPOINTS.ASSETS, asset)
    }

    /**
     * Update asset
     */
    async updateAsset(id: number, asset: Partial<Omit<Asset, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Asset>> {
        return this.put<ApiResponse<Asset>>(`${API_ENDPOINTS.ASSETS}/${id}`, asset)
    }

    /**
     * Delete asset
     */
    async deleteAsset(id: number): Promise<ApiResponse<void>> {
        return this.delete<ApiResponse<void>>(`${API_ENDPOINTS.ASSETS}/${id}`)
    }

    /**
     * Get asset categories
     */
    async getAssetCategories(): Promise<ApiResponse<string[]>> {
        return this.get<ApiResponse<string[]>>(`${API_ENDPOINTS.ASSETS}/categories`)
    }

    /**
     * Calculate asset depreciation
     */
    async calculateDepreciation(id: number, date?: string): Promise<ApiResponse<{ current_value: number; depreciation: number }>> {
        return this.get<ApiResponse<{ current_value: number; depreciation: number }>>(`${API_ENDPOINTS.ASSETS}/${id}/depreciation`, {
            params: { date }
        })
    }

    /**
     * Get asset summary statistics
     */
    async getAssetSummary(): Promise<ApiResponse<{
        total_value: number
        total_depreciation: number
        asset_count: number
        category_breakdown: Array<{ category: string; count: number; value: number }>
    }>> {
        return this.get<ApiResponse<{
            total_value: number
            total_depreciation: number
            asset_count: number
            category_breakdown: Array<{ category: string; count: number; value: number }>
        }>>(`${API_ENDPOINTS.ASSETS}/summary`)
    }
}

export const assetService = new AssetService()
