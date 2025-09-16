// Transaction Types
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
} as const

export const TRANSACTION_METHODS = {
    SALES: 'sales',
    CAPEX: 'capex',
    OPEX: 'opex',
} as const

// Employee Types
export const EMPLOYEE_TYPES = {
    FULL_TIME: 'full-time',
    FREELANCE: 'freelance',
    CONTRACT: 'contract',
} as const

// Project Status
export const PROJECT_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    ON_HOLD: 'on_hold',
    CANCELLED: 'cancelled',
} as const

// Asset Status
export const ASSET_STATUS = {
    ACTIVE: 'active',
    DEPRECATED: 'deprecated',
    SOLD: 'sold',
} as const

// Employee Status
export const EMPLOYEE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const

// Date Range Presets
export const DATE_RANGE_PRESETS = {
    TODAY: { label: 'Today', days: 0 },
    YESTERDAY: { label: 'Yesterday', days: 1 },
    THIS_WEEK: { label: 'This Week', days: 7 },
    LAST_WEEK: { label: 'Last Week', days: 14 },
    THIS_MONTH: { label: 'This Month', days: 30 },
    LAST_MONTH: { label: 'Last Month', days: 60 },
    THIS_QUARTER: { label: 'This Quarter', days: 90 },
    LAST_QUARTER: { label: 'Last Quarter', days: 180 },
    THIS_YEAR: { label: 'This Year', days: 365 },
    LAST_YEAR: { label: 'Last Year', days: 730 },
} as const

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

// API Configuration
export const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
} as const

// Chart Colors
export const CHART_COLORS = {
    PRIMARY: '#3b82f6',
    SECONDARY: '#10b981',
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#06b6d4',
    PURPLE: '#8b5cf6',
    PINK: '#ec4899',
    ORANGE: '#f97316',
    TEAL: '#14b8a6',
    INDIGO: '#6366f1',
} as const

// Financial Ratios Categories
export const RATIO_CATEGORIES = {
    LIQUIDITY: 'Liquidity Ratios',
    LEVERAGE: 'Leverage Ratios',
    PROFITABILITY: 'Profitability Ratios',
    EFFICIENCY: 'Efficiency Ratios',
    VALUATION: 'Valuation Ratios',
} as const

// Export Formats
export const EXPORT_FORMATS = {
    CSV: 'csv',
    EXCEL: 'excel',
    PDF: 'pdf',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
} as const

// Priority Levels
export const PRIORITY_LEVELS = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
} as const

// Trend Directions
export const TREND_DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    STABLE: 'stable',
} as const
