// Core Entity Types
export interface Transaction {
    id: number
    type: "income" | "expense"
    method: "sales" | "capex" | "opex"
    category_id: number
    project_id?: number
    tag_id?: number
    amount: number
    description: string
    date: string
    created_at: string
    updated_at: string
    // Relations
    category?: Category
    project?: Project
    tag?: Tag
}

export interface Category {
    id: number
    name: string
    type: "income" | "expense"
    description?: string
    created_at: string
    updated_at: string
}

export interface Project {
    id: number
    name: string
    description: string
    start_date: string
    end_date?: string
    status: "active" | "completed" | "on_hold" | "cancelled"
    budget?: number
    created_at: string
    updated_at: string
}

export interface Tag {
    id: number
    name: string
    color?: string
    description?: string
    created_at: string
    updated_at: string
}

export interface Asset {
    id: number
    name: string
    category: string
    purchase_date: string
    cost: number
    depreciation_rate: number
    lifetime_years: number
    description: string
    current_value?: number
    status: "active" | "deprecated" | "sold"
    created_at: string
    updated_at: string
}

export interface Employee {
    id: number
    name: string
    email: string
    position: string
    type: "full-time" | "freelance" | "contract"
    current_salary?: number
    start_date: string
    end_date?: string
    status: "active" | "inactive"
    created_at: string
    updated_at: string
}

export interface SalaryHistory {
    id: number
    employee_id: number
    amount: number
    start_date: string
    end_date?: string
    created_at: string
    updated_at: string
    // Relations
    employee?: Employee
}

// Financial Data Types
export interface FinancialPerformance {
    period: string
    net_income: number
    total_assets: number
    total_equity: number
    operating_income: number
    ebitda: number
    revenue: number
    gross_profit: number
    interest_expense: number
    tax_expense: number
    depreciation_amortization: number
}

export interface BalanceSheetSnapshot {
    period: string
    current_assets: number
    current_liabilities: number
    total_assets: number
    total_liabilities: number
    total_equity: number
    cash_equivalents: number
    inventory: number
    accounts_receivable: number
    accounts_payable: number
    short_term_debt: number
    long_term_debt: number
}

export interface CashConversionData {
    period: string
    dio: number // Days Inventory Outstanding
    dso: number // Days Sales Outstanding
    dpo: number // Days Payable Outstanding
    ccc: number // Cash Conversion Cycle
    average_inventory: number
    cost_of_goods_sold: number
    credit_sales: number
}

export interface ValuationInputs {
    market_cap: number
    total_debt: number
    cash_equivalents: number
    tax_rate: number
    cost_of_equity: number
    cost_of_debt: number
    beta: number
    risk_free_rate: number
    market_risk_premium: number
}

export interface FinancialRatios {
    // Liquidity Ratios
    current_ratio: number
    quick_ratio: number
    cash_ratio: number
    operating_cash_flow_ratio: number

    // Leverage Ratios
    debt_to_equity: number
    debt_ratio: number
    equity_ratio: number
    interest_coverage: number

    // Profitability Ratios
    gross_margin: number
    net_margin: number
    ebitda_margin: number
    roa: number
    roe: number
    roi: number

    // Efficiency Ratios
    asset_turnover: number
    equity_multiplier: number

    // Valuation Ratios
    book_value_per_share: number
    earnings_per_share: number
    price_earnings_ratio: number
}

export interface DuPontAnalysis {
    roe: number
    net_profit_margin: number
    asset_turnover: number
    equity_multiplier: number
    profit_margin_contribution: number
    asset_efficiency_contribution: number
    leverage_contribution: number
}

// UI Types
export interface DateRange {
    start: string
    end: string
    label: string
}

export interface FilterOptions {
    type?: string
    method?: string
    category_id?: number
    project_id?: number
    tag_id?: number
    date_range?: DateRange
}
