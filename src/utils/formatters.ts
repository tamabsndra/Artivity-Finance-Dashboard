// Currency formatting
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount)
}

// Number formatting
export function formatNumber(
    value: number,
    decimals: number = 2,
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

// Percentage formatting
export function formatPercentage(
    value: number,
    decimals: number = 2,
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100)
}

// Date formatting
export function formatDate(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
    locale: string = 'en-US'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

// Date range formatting
export function formatDateRange(
    startDate: string | Date,
    endDate: string | Date,
    locale: string = 'en-US'
): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate

    return `${formatDate(start, { month: 'short', day: 'numeric' }, locale)} - ${formatDate(end, { month: 'short', day: 'numeric', year: 'numeric' }, locale)}`
}

// File size formatting
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Duration formatting
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`
    } else {
        return `${remainingSeconds}s`
    }
}

// Compact number formatting (e.g., 1.2K, 1.5M)
export function formatCompactNumber(value: number): string {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K'
    } else {
        return value.toString()
    }
}

// Financial ratio formatting
export function formatRatio(value: number, decimals: number = 2): string {
    return formatNumber(value, decimals)
}

// Change formatting (with + or - prefix)
export function formatChange(value: number, showSign: boolean = true): string {
    const formatted = formatNumber(Math.abs(value), 2)
    if (value > 0 && showSign) {
        return `+${formatted}`
    } else if (value < 0 && showSign) {
        return `-${formatted}`
    }
    return formatted
}

// Change percentage formatting
export function formatChangePercentage(value: number, showSign: boolean = true): string {
    const formatted = formatPercentage(Math.abs(value), 1)
    if (value > 0 && showSign) {
        return `+${formatted}`
    } else if (value < 0 && showSign) {
        return `-${formatted}`
    }
    return formatted
}
