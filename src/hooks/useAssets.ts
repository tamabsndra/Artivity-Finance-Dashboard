import { useState, useEffect, useCallback } from 'react'
import { assetService } from '@/services/api/assetService'
import type { Asset } from '@/types/entities'
import type { PaginationParams, PaginatedResponse } from '@/types/api'

interface AssetFilters extends PaginationParams {
    search?: string
    category?: string
    min_value?: number
    max_value?: number
}

interface AssetSummary {
    total_value: number
    total_depreciation: number
    asset_count: number
    category_breakdown: Array<{ category: string; count: number; value: number }>
}

export function useAssets(filters: AssetFilters = { page: 1, limit: 10 }) {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginatedResponse<Asset>['pagination'] | null>(null)

    const fetchAssets = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await assetService.getAssets(filters)
            setAssets(response.data)
            setPagination(response.pagination)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch assets')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    const createAsset = useCallback(async (assetData: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const response = await assetService.createAsset(assetData)
            setAssets(prev => [response.data, ...prev])
            return response.data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create asset')
            throw err
        }
    }, [])

    const updateAsset = useCallback(async (id: number, assetData: Partial<Omit<Asset, 'id' | 'created_at' | 'updated_at'>>) => {
        try {
            const response = await assetService.updateAsset(id, assetData)
            setAssets(prev => prev.map(asset => asset.id === id ? response.data : asset))
            return response.data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update asset')
            throw err
        }
    }, [])

    const deleteAsset = useCallback(async (id: number) => {
        try {
            await assetService.deleteAsset(id)
            setAssets(prev => prev.filter(asset => asset.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete asset')
            throw err
        }
    }, [])

    return {
        assets,
        loading,
        error,
        pagination,
        createAsset,
        updateAsset,
        deleteAsset,
        refetch: fetchAssets
    }
}

export function useAssetSummary() {
    const [summary, setSummary] = useState<AssetSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSummary = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await assetService.getAssetSummary()
            setSummary(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch asset summary')
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

export function useAssetCategories() {
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await assetService.getAssetCategories()
            setCategories(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories
    }
}
