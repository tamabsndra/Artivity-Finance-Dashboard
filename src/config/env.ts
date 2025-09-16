// Environment configuration
export const env = {
    // API Configuration
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true' || process.env.NODE_ENV === 'development',

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',

    // Authentication (Future Implementation)
    AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000/auth',

    // Feature Flags
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
    ENABLE_FORECASTING: process.env.NEXT_PUBLIC_ENABLE_FORECASTING !== 'false',
    ENABLE_REPORTS: process.env.NEXT_PUBLIC_ENABLE_REPORTS !== 'false',

    // External Services (Future Implementation)
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
} as const

// Type-safe environment validation
export function validateEnv() {
    const requiredVars = [
        'NEXT_PUBLIC_API_URL',
    ]

    const missingVars = requiredVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        console.warn(`Missing environment variables: ${missingVars.join(', ')}`)
    }

    return missingVars.length === 0
}

// Initialize environment validation
if (typeof window === 'undefined') {
    validateEnv()
}
