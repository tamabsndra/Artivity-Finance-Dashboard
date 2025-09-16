// API Services
export { apiClient, ApiClient, ApiError } from './api/base'
export { API_ENDPOINTS } from './api/endpoints'
export { transactionService, TransactionService } from './api/transactionService'
export { financialService, FinancialService } from './api/financialService'
export { assetService, AssetService } from './api/assetService'
export { employeeService, EmployeeService } from './api/employeeService'

// Mock Services (for development)
export { mockTransactionService, MockTransactionService } from './mock/mockTransactionService'
export * from './mock/mockData'

// Service Factory (to switch between real API and mock)
export class ServiceFactory {
    private static useMock = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    static getTransactionService() {
        return this.useMock ? mockTransactionService : transactionService
    }

    static getFinancialService() {
        return financialService // Always use real service for financial data
    }

    static getAssetService() {
        return assetService // Always use real service for asset data
    }

    static getEmployeeService() {
        return employeeService // Always use real service for employee data
    }

    static setUseMock(useMock: boolean) {
        this.useMock = useMock
    }

    static isUsingMock() {
        return this.useMock
    }
}
