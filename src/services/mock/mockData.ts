import {
    Transaction,
    Category,
    Project,
    Tag,
    Asset,
    Employee,
    SalaryHistory,
    FinancialPerformance,
    BalanceSheetSnapshot,
    CashConversionData,
    ValuationInputs,
    FinancialRatios,
    DuPontAnalysis
} from '@/types/entities'

// Mock Categories
export const mockCategories: Category[] = [
    { id: 1, name: "Sales Revenue", type: "income", description: "Revenue from product sales", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Service Revenue", type: "income", description: "Revenue from services", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 3, name: "Marketing", type: "expense", description: "Marketing and advertising expenses", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 4, name: "Salaries", type: "expense", description: "Employee salaries and benefits", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 5, name: "Office Rent", type: "expense", description: "Office rent and utilities", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 6, name: "Equipment", type: "expense", description: "Equipment and software purchases", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
]

// Mock Projects
export const mockProjects: Project[] = [
    { id: 1, name: "Mobile App Development", description: "iOS and Android app development", start_date: "2024-01-01", status: "active", budget: 50000, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Website Redesign", description: "Complete website redesign project", start_date: "2024-02-01", end_date: "2024-04-30", status: "completed", budget: 25000, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-04-30T00:00:00Z" },
    { id: 3, name: "Marketing Campaign", description: "Q2 marketing campaign", start_date: "2024-04-01", status: "active", budget: 15000, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-04-01T00:00:00Z" },
]

// Mock Tags
export const mockTags: Tag[] = [
    { id: 1, name: "Urgent", color: "#ef4444", description: "High priority items", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Recurring", color: "#3b82f6", description: "Recurring transactions", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 3, name: "Tax Deductible", color: "#10b981", description: "Tax deductible expenses", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
    {
        id: 1,
        type: "income",
        method: "sales",
        category_id: 1,
        project_id: 1,
        tag_id: 2,
        amount: 15000,
        description: "Mobile app subscription revenue",
        date: "2024-03-01",
        created_at: "2024-03-01T10:00:00Z",
        updated_at: "2024-03-01T10:00:00Z",
        category: mockCategories[0],
        project: mockProjects[0],
        tag: mockTags[1]
    },
    {
        id: 2,
        type: "expense",
        method: "opex",
        category_id: 3,
        project_id: 3,
        tag_id: 3,
        amount: 5000,
        description: "Google Ads campaign",
        date: "2024-03-02",
        created_at: "2024-03-02T14:30:00Z",
        updated_at: "2024-03-02T14:30:00Z",
        category: mockCategories[2],
        project: mockProjects[2],
        tag: mockTags[2]
    },
    {
        id: 3,
        type: "expense",
        method: "opex",
        category_id: 4,
        amount: 12000,
        description: "Monthly salaries",
        date: "2024-03-05",
        created_at: "2024-03-05T09:00:00Z",
        updated_at: "2024-03-05T09:00:00Z",
        category: mockCategories[3]
    },
    {
        id: 4,
        type: "income",
        method: "sales",
        category_id: 2,
        project_id: 2,
        amount: 8000,
        description: "Website development service",
        date: "2024-03-10",
        created_at: "2024-03-10T16:45:00Z",
        updated_at: "2024-03-10T16:45:00Z",
        category: mockCategories[1],
        project: mockProjects[1]
    },
    {
        id: 5,
        type: "expense",
        method: "capex",
        category_id: 6,
        amount: 3000,
        description: "New MacBook Pro for development",
        date: "2024-03-15",
        created_at: "2024-03-15T11:20:00Z",
        updated_at: "2024-03-15T11:20:00Z",
        category: mockCategories[5]
    }
]

// Mock Assets
export const mockAssets: Asset[] = [
    {
        id: 1,
        name: "Office Building",
        category: "Real Estate",
        purchase_date: "2023-01-01",
        cost: 500000,
        depreciation_rate: 2.5,
        lifetime_years: 40,
        description: "Main office building",
        current_value: 487500,
        status: "active",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 2,
        name: "Development Servers",
        category: "IT Equipment",
        purchase_date: "2023-06-01",
        cost: 25000,
        depreciation_rate: 20,
        lifetime_years: 5,
        description: "High-performance servers for development",
        current_value: 15000,
        status: "active",
        created_at: "2023-06-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 3,
        name: "Office Furniture",
        category: "Furniture",
        purchase_date: "2023-03-01",
        cost: 15000,
        depreciation_rate: 10,
        lifetime_years: 10,
        description: "Desks, chairs, and office furniture",
        current_value: 12000,
        status: "active",
        created_at: "2023-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    }
]

// Mock Employees
export const mockEmployees: Employee[] = [
    {
        id: 1,
        name: "John Doe",
        email: "john@artivity.com",
        position: "Senior Developer",
        type: "full-time",
        current_salary: 8000,
        start_date: "2023-01-15",
        status: "active",
        created_at: "2023-01-15T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@artivity.com",
        position: "UI/UX Designer",
        type: "full-time",
        current_salary: 6000,
        start_date: "2023-03-01",
        status: "active",
        created_at: "2023-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike@artivity.com",
        position: "Marketing Specialist",
        type: "contract",
        current_salary: 4000,
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        status: "active",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    }
]

// Mock Salary History
export const mockSalaryHistory: SalaryHistory[] = [
    {
        id: 1,
        employee_id: 1,
        amount: 7500,
        start_date: "2023-01-15",
        end_date: "2023-12-31",
        created_at: "2023-01-15T00:00:00Z",
        updated_at: "2023-01-15T00:00:00Z",
        employee: mockEmployees[0]
    },
    {
        id: 2,
        employee_id: 1,
        amount: 8000,
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        employee: mockEmployees[0]
    },
    {
        id: 3,
        employee_id: 2,
        amount: 5500,
        start_date: "2023-03-01",
        end_date: "2023-12-31",
        created_at: "2023-03-01T00:00:00Z",
        updated_at: "2023-03-01T00:00:00Z",
        employee: mockEmployees[1]
    },
    {
        id: 4,
        employee_id: 2,
        amount: 6000,
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        employee: mockEmployees[1]
    }
]

// Mock Financial Performance
export const mockFinancialPerformance: FinancialPerformance[] = [
    {
        period: "2024-01",
        net_income: 25000,
        total_assets: 750000,
        total_equity: 500000,
        operating_income: 30000,
        ebitda: 35000,
        revenue: 80000,
        gross_profit: 60000,
        interest_expense: 2000,
        tax_expense: 5000,
        depreciation_amortization: 5000
    },
    {
        period: "2024-02",
        net_income: 28000,
        total_assets: 780000,
        total_equity: 520000,
        operating_income: 32000,
        ebitda: 37000,
        revenue: 85000,
        gross_profit: 63000,
        interest_expense: 2000,
        tax_expense: 5500,
        depreciation_amortization: 5000
    },
    {
        period: "2024-03",
        net_income: 32000,
        total_assets: 800000,
        total_equity: 540000,
        operating_income: 38000,
        ebitda: 42000,
        revenue: 95000,
        gross_profit: 70000,
        interest_expense: 2000,
        tax_expense: 6000,
        depreciation_amortization: 5000
    }
]

// Mock Balance Sheet
export const mockBalanceSheet: BalanceSheetSnapshot[] = [
    {
        period: "2024-03",
        current_assets: 150000,
        current_liabilities: 50000,
        total_assets: 800000,
        total_liabilities: 260000,
        total_equity: 540000,
        cash_equivalents: 80000,
        inventory: 20000,
        accounts_receivable: 30000,
        accounts_payable: 25000,
        short_term_debt: 15000,
        long_term_debt: 200000
    }
]

// Mock Cash Conversion Data
export const mockCashConversionData: CashConversionData[] = [
    {
        period: "2024-03",
        dio: 30,
        dso: 25,
        dpo: 20,
        ccc: 35,
        average_inventory: 20000,
        cost_of_goods_sold: 25000,
        credit_sales: 95000
    }
]

// Mock Valuation Inputs
export const mockValuationInputs: ValuationInputs = {
    market_cap: 2000000,
    total_debt: 260000,
    cash_equivalents: 80000,
    tax_rate: 0.25,
    cost_of_equity: 0.12,
    cost_of_debt: 0.06,
    beta: 1.2,
    risk_free_rate: 0.03,
    market_risk_premium: 0.07
}

// Mock Financial Ratios
export const mockFinancialRatios: FinancialRatios = {
    current_ratio: 3.0,
    quick_ratio: 2.6,
    cash_ratio: 1.6,
    operating_cash_flow_ratio: 2.5,
    debt_to_equity: 0.48,
    debt_ratio: 0.33,
    equity_ratio: 0.68,
    interest_coverage: 19.0,
    gross_margin: 0.74,
    net_margin: 0.34,
    ebitda_margin: 0.44,
    roa: 0.04,
    roe: 0.059,
    roi: 0.12,
    asset_turnover: 0.12,
    equity_multiplier: 1.48,
    book_value_per_share: 54.0,
    earnings_per_share: 3.2,
    price_earnings_ratio: 6.25
}

// Mock DuPont Analysis
export const mockDuPontAnalysis: DuPontAnalysis = {
    roe: 0.059,
    net_profit_margin: 0.34,
    asset_turnover: 0.12,
    equity_multiplier: 1.48,
    profit_margin_contribution: 0.34,
    asset_efficiency_contribution: 0.12,
    leverage_contribution: 1.48
}
