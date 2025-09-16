// API Endpoints Configuration
export const API_ENDPOINTS = {
    // Transactions
    TRANSACTIONS: {
        LIST: '/transactions',
        CREATE: '/transactions',
        GET: (id: number) => `/transactions/${id}`,
        UPDATE: (id: number) => `/transactions/${id}`,
        DELETE: (id: number) => `/transactions/${id}`,
        BULK_CREATE: '/transactions/bulk',
        BULK_UPDATE: '/transactions/bulk',
        BULK_DELETE: '/transactions/bulk',
        SUMMARY: '/transactions/summary',
        EXPORT: '/transactions/export',
    },

    // Categories
    CATEGORIES: {
        LIST: '/categories',
        CREATE: '/categories',
        GET: (id: number) => `/categories/${id}`,
        UPDATE: (id: number) => `/categories/${id}`,
        DELETE: (id: number) => `/categories/${id}`,
    },

    // Projects
    PROJECTS: {
        LIST: '/projects',
        CREATE: '/projects',
        GET: (id: number) => `/projects/${id}`,
        UPDATE: (id: number) => `/projects/${id}`,
        DELETE: (id: number) => `/projects/${id}`,
    },

    // Tags
    TAGS: {
        LIST: '/tags',
        CREATE: '/tags',
        GET: (id: number) => `/tags/${id}`,
        UPDATE: (id: number) => `/tags/${id}`,
        DELETE: (id: number) => `/tags/${id}`,
    },

    // Assets
    ASSETS: {
        LIST: '/assets',
        CREATE: '/assets',
        GET: (id: number) => `/assets/${id}`,
        UPDATE: (id: number) => `/assets/${id}`,
        DELETE: (id: number) => `/assets/${id}`,
        DEPRECIATION: '/assets/depreciation',
    },

    // Employees
    EMPLOYEES: {
        LIST: '/employees',
        CREATE: '/employees',
        GET: (id: number) => `/employees/${id}`,
        UPDATE: (id: number) => `/employees/${id}`,
        DELETE: (id: number) => `/employees/${id}`,
    },

    // Salary History
    SALARY_HISTORY: {
        LIST: '/salary-history',
        CREATE: '/salary-history',
        GET: (id: number) => `/salary-history/${id}`,
        UPDATE: (id: number) => `/salary-history/${id}`,
        DELETE: (id: number) => `/salary-history/${id}`,
        BY_EMPLOYEE: (employeeId: number) => `/salary-history/employee/${employeeId}`,
    },

    // Financial Reports
    FINANCIAL: {
        PERFORMANCE: '/financial/performance',
        BALANCE_SHEET: '/financial/balance-sheet',
        CASH_CONVERSION: '/financial/cash-conversion',
        RATIOS: '/financial/ratios',
        DUPONT_ANALYSIS: '/financial/dupont-analysis',
        VALUATION: '/financial/valuation',
        FORECASTING: '/financial/forecasting',
    },

    // Reports
    REPORTS: {
        GENERATE: '/reports/generate',
        EXPORT: '/reports/export',
        TEMPLATES: '/reports/templates',
    },

    // Dashboard
    DASHBOARD: {
        OVERVIEW: '/dashboard/overview',
        METRICS: '/dashboard/metrics',
        CHARTS: '/dashboard/charts',
    },

    // Analytics
    ANALYTICS: {
        TRENDS: '/analytics/trends',
        INSIGHTS: '/analytics/insights',
        PREDICTIONS: '/analytics/predictions',
    },
} as const

// Request/Response Type Mappings
export type EndpointType = keyof typeof API_ENDPOINTS
export type EndpointPath<T extends EndpointType> = typeof API_ENDPOINTS[T]
