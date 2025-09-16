import { useState, useEffect, useCallback } from 'react'
import {
    FinancialPerformance,
    BalanceSheetSnapshot,
    CashConversionData,
    ValuationInputs,
    FinancialRatios,
    DuPontAnalysis
} from '@/types/entities'
import { mockFinancialPerformance, mockBalanceSheet, mockCashConversionData, mockValuationInputs, mockFinancialRatios, mockDuPontAnalysis } from '@/services/mock/mockData'

interface UseFinancialPerformanceReturn {
    data: FinancialPerformance[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useFinancialPerformance(): UseFinancialPerformanceReturn {
    const [data, setData] = useState<FinancialPerformance[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockFinancialPerformance)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch financial performance data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

interface UseBalanceSheetReturn {
    data: BalanceSheetSnapshot[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useBalanceSheet(): UseBalanceSheetReturn {
    const [data, setData] = useState<BalanceSheetSnapshot[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockBalanceSheet)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch balance sheet data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

interface UseCashConversionReturn {
    data: CashConversionData[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useCashConversion(): UseCashConversionReturn {
    const [data, setData] = useState<CashConversionData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockCashConversionData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cash conversion data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

interface UseValuationInputsReturn {
    data: ValuationInputs | null
    loading: boolean
    error: string | null
    updateValuationInputs: (data: Partial<ValuationInputs>) => Promise<void>
    refetch: () => Promise<void>
}

export function useValuationInputs(): UseValuationInputsReturn {
    const [data, setData] = useState<ValuationInputs | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockValuationInputs)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch valuation inputs')
        } finally {
            setLoading(false)
        }
    }, [])

    const updateValuationInputs = useCallback(async (newData: Partial<ValuationInputs>) => {
        try {
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(prev => prev ? { ...prev, ...newData } : null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update valuation inputs')
            throw err
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        updateValuationInputs,
        refetch: fetchData,
    }
}

interface UseFinancialRatiosReturn {
    data: FinancialRatios | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useFinancialRatios(): UseFinancialRatiosReturn {
    const [data, setData] = useState<FinancialRatios | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockFinancialRatios)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch financial ratios')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

interface UseDuPontAnalysisReturn {
    data: DuPontAnalysis | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useDuPontAnalysis(): UseDuPontAnalysisReturn {
    const [data, setData] = useState<DuPontAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))
            setData(mockDuPontAnalysis)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch DuPont analysis')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}
