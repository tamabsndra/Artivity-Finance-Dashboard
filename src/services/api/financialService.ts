import { apiClient } from './base'
import { API_ENDPOINTS } from './endpoints'
import {
    FinancialPerformance,
    BalanceSheetSnapshot,
    CashConversionData,
    ValuationInputs,
    FinancialRatios,
    DuPontAnalysis
} from '@/types/entities'
import { QueryParams, DateRangeFilter } from '@/types/api'

export interface ForecastingRequest {
    period_months: number
    growth_rate?: number
    assumptions?: Record<string, any>
}

export interface ForecastingResponse {
    periods: string[]
    revenue_forecast: number[]
    expense_forecast: number[]
    net_income_forecast: number[]
    confidence_interval: {
        lower: number[]
        upper: number[]
    }
}

export class FinancialService {
    // Get financial performance data
    async getFinancialPerformance(filters?: QueryParams & DateRangeFilter): Promise<FinancialPerformance[]> {
        const response = await apiClient.get<FinancialPerformance[]>(
            API_ENDPOINTS.FINANCIAL.PERFORMANCE,
            filters
        )
        return response.data
    }

    // Get balance sheet data
    async getBalanceSheet(filters?: QueryParams & DateRangeFilter): Promise<BalanceSheetSnapshot[]> {
        const response = await apiClient.get<BalanceSheetSnapshot[]>(
            API_ENDPOINTS.FINANCIAL.BALANCE_SHEET,
            filters
        )
        return response.data
    }

    // Get cash conversion cycle data
    async getCashConversionData(filters?: QueryParams & DateRangeFilter): Promise<CashConversionData[]> {
        const response = await apiClient.get<CashConversionData[]>(
            API_ENDPOINTS.FINANCIAL.CASH_CONVERSION,
            filters
        )
        return response.data
    }

    // Get financial ratios
    async getFinancialRatios(filters?: QueryParams & DateRangeFilter): Promise<FinancialRatios[]> {
        const response = await apiClient.get<FinancialRatios[]>(
            API_ENDPOINTS.FINANCIAL.RATIOS,
            filters
        )
        return response.data
    }

    // Get DuPont analysis
    async getDuPontAnalysis(filters?: QueryParams & DateRangeFilter): Promise<DuPontAnalysis[]> {
        const response = await apiClient.get<DuPontAnalysis[]>(
            API_ENDPOINTS.FINANCIAL.DUPONT_ANALYSIS,
            filters
        )
        return response.data
    }

    // Get valuation inputs
    async getValuationInputs(): Promise<ValuationInputs> {
        const response = await apiClient.get<ValuationInputs>(
            API_ENDPOINTS.FINANCIAL.VALUATION
        )
        return response.data
    }

    // Update valuation inputs
    async updateValuationInputs(data: Partial<ValuationInputs>): Promise<ValuationInputs> {
        const response = await apiClient.put<ValuationInputs>(
            API_ENDPOINTS.FINANCIAL.VALUATION,
            data
        )
        return response.data
    }

    // Get financial forecasting
    async getFinancialForecasting(request: ForecastingRequest): Promise<ForecastingResponse> {
        const response = await apiClient.post<ForecastingResponse>(
            API_ENDPOINTS.FINANCIAL.FORECASTING,
            request
        )
        return response.data
    }

    // Get dashboard metrics
    async getDashboardMetrics(): Promise<{
        total_revenue: number
        total_expenses: number
        net_income: number
        profit_margin: number
        growth_rate: number
        cash_flow: number
        assets_value: number
        liabilities_value: number
        equity_value: number
    }> {
        const response = await apiClient.get(
            API_ENDPOINTS.DASHBOARD.METRICS
        )
        return response.data
    }

    // Get analytics insights
    async getAnalyticsInsights(): Promise<{
        trends: Array<{
            metric: string
            trend: 'up' | 'down' | 'stable'
            percentage_change: number
            period: string
        }>
        predictions: Array<{
            metric: string
            predicted_value: number
            confidence: number
            period: string
        }>
        recommendations: Array<{
            category: string
            title: string
            description: string
            priority: 'high' | 'medium' | 'low'
            impact: number
        }>
    }> {
        const response = await apiClient.get(
            API_ENDPOINTS.ANALYTICS.INSIGHTS
        )
        return response.data
    }
}

// Export singleton instance
export const financialService = new FinancialService()
