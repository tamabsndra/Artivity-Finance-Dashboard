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

// Mock Categories - Artivity Printing Company
export const mockCategories: Category[] = [
    { id: 1, name: "Penjualan Cetak", type: "income", description: "Pendapatan dari jasa percetakan", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Jasa Desain", type: "income", description: "Pendapatan dari jasa desain grafis", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 3, name: "Marketing", type: "expense", description: "Biaya pemasaran dan promosi", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 4, name: "Gaji Karyawan", type: "expense", description: "Gaji dan tunjangan karyawan", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 5, name: "Sewa Gedung", type: "expense", description: "Sewa gedung dan utilitas", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 6, name: "Bahan Baku", type: "expense", description: "Kertas, tinta, dan bahan cetak", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
]

// Mock Projects - Artivity Printing Company
export const mockProjects: Project[] = [
    { id: 1, name: "Cetak Brosur Perusahaan", description: "Proyek cetak brosur untuk klien korporat", start_date: "2024-01-01", status: "active", budget: 50000000, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Desain Katalog Produk", description: "Proyek desain katalog produk untuk e-commerce", start_date: "2024-02-01", end_date: "2024-04-30", status: "completed", budget: 25000000, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-04-30T00:00:00Z" },
    { id: 3, name: "Cetak Banner Event", description: "Proyek cetak banner untuk event tahunan", start_date: "2024-04-01", status: "active", budget: 15000000, created_at: "2024-04-01T00:00:00Z", updated_at: "2024-04-01T00:00:00Z" },
]

// Mock Tags - Artivity Printing Company
export const mockTags: Tag[] = [
    { id: 1, name: "Urgent", color: "#ef4444", description: "Proyek prioritas tinggi", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "Rutin", color: "#3b82f6", description: "Transaksi rutin bulanan", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    { id: 3, name: "Dapat Dipotong Pajak", color: "#10b981", description: "Biaya yang dapat dipotong pajak", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
]

// Mock Transactions - Artivity Printing Company
export const mockTransactions: Transaction[] = [
    {
        id: 1,
        type: "income",
        method: "sales",
        category_id: 1,
        project_id: 1,
        tag_id: 2,
        amount: 15000000,
        description: "Pendapatan cetak brosur perusahaan",
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
        amount: 5000000,
        description: "Biaya iklan Google Ads",
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
        amount: 12000000,
        description: "Gaji karyawan bulan Maret",
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
        amount: 8000000,
        description: "Jasa desain katalog produk",
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
        amount: 3000000,
        description: "Pembelian kertas premium untuk proyek",
        date: "2024-03-15",
        created_at: "2024-03-15T11:20:00Z",
        updated_at: "2024-03-15T11:20:00Z",
        category: mockCategories[5]
    }
]

// Mock Assets - Artivity Printing Equipment
export const mockAssets: Asset[] = [
    {
        id: 1,
        name: "Gedung Kantor",
        category: "Real Estate",
        purchase_date: "2020-01-01",
        cost: 500000000,
        depreciation_rate: 2.5,
        lifetime_years: 40,
        description: "Gedung kantor utama Artivity Printing",
        current_value: 487500000,
        status: "active",
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 2,
        name: "Mesin Offset Heidelberg",
        category: "Printing Equipment",
        purchase_date: "2021-03-01",
        cost: 450000000,
        depreciation_rate: 20,
        lifetime_years: 5,
        description: "Mesin cetak offset untuk produksi besar",
        current_value: 270000000,
        status: "active",
        created_at: "2021-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 3,
        name: "Mesin Digital Xerox",
        category: "Printing Equipment",
        purchase_date: "2022-03-01",
        cost: 45000000,
        depreciation_rate: 20,
        lifetime_years: 5,
        description: "Mesin cetak digital untuk order kecil dan cepat",
        current_value: 27000000,
        status: "active",
        created_at: "2022-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 4,
        name: "Mesin Laminating",
        category: "Finishing Equipment",
        purchase_date: "2021-09-01",
        cost: 125000000,
        depreciation_rate: 12,
        lifetime_years: 8,
        description: "Mesin laminating untuk finishing premium",
        current_value: 87500000,
        status: "active",
        created_at: "2021-09-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 5,
        name: "Mesin Binding Perfect Binding",
        category: "Finishing Equipment",
        purchase_date: "2022-01-01",
        cost: 180000000,
        depreciation_rate: 12,
        lifetime_years: 8,
        description: "Mesin binding untuk buku dan katalog",
        current_value: 126000000,
        status: "active",
        created_at: "2022-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 6,
        name: "Komputer Desain Grafis",
        category: "IT Equipment",
        purchase_date: "2023-01-01",
        cost: 45000000,
        depreciation_rate: 25,
        lifetime_years: 4,
        description: "Workstation untuk desain grafis dan prepress",
        current_value: 22500000,
        status: "active",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 7,
        name: "Forklift",
        category: "Material Handling",
        purchase_date: "2021-12-01",
        cost: 75000000,
        depreciation_rate: 15,
        lifetime_years: 7,
        description: "Forklift untuk handling kertas dan produk jadi",
        current_value: 45000000,
        status: "active",
        created_at: "2021-12-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    }
]

// Mock Employees - Artivity Printing Company
export const mockEmployees: Employee[] = [
    {
        id: 1,
        name: "Budi Santoso",
        email: "budi@artivity.com",
        position: "Direktur Utama",
        type: "full-time",
        current_salary: 25000000,
        start_date: "2020-01-01",
        status: "active",
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 2,
        name: "Siti Rahayu",
        email: "siti@artivity.com",
        position: "Manager Produksi",
        type: "full-time",
        current_salary: 15000000,
        start_date: "2020-06-01",
        status: "active",
        created_at: "2020-06-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 3,
        name: "Ahmad Wijaya",
        email: "ahmad@artivity.com",
        position: "Desainer Grafis Senior",
        type: "full-time",
        current_salary: 12000000,
        start_date: "2021-03-01",
        status: "active",
        created_at: "2021-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 4,
        name: "Rina Sari",
        email: "rina@artivity.com",
        position: "Operator Mesin Offset",
        type: "full-time",
        current_salary: 8000000,
        start_date: "2021-08-01",
        status: "active",
        created_at: "2021-08-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 5,
        name: "Dedi Kurniawan",
        email: "dedi@artivity.com",
        position: "Teknisi Maintenance",
        type: "full-time",
        current_salary: 9000000,
        start_date: "2022-01-01",
        status: "active",
        created_at: "2022-01-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 6,
        name: "Maya Putri",
        email: "maya@artivity.com",
        position: "Sales Executive",
        type: "full-time",
        current_salary: 10000000,
        start_date: "2022-05-01",
        status: "active",
        created_at: "2022-05-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 7,
        name: "Agus Prasetyo",
        email: "agus@artivity.com",
        position: "Quality Control",
        type: "full-time",
        current_salary: 7500000,
        start_date: "2022-09-01",
        status: "active",
        created_at: "2022-09-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    },
    {
        id: 8,
        name: "Lisa Dewi",
        email: "lisa@artivity.com",
        position: "Desainer Grafis Junior",
        type: "contract",
        current_salary: 6000000,
        start_date: "2023-02-01",
        end_date: "2024-12-31",
        status: "active",
        created_at: "2023-02-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
    }
]

// Mock Salary History - Artivity Printing Company
export const mockSalaryHistory: SalaryHistory[] = [
    {
        id: 1,
        employee_id: 1,
        amount: 20000000,
        start_date: "2020-01-01",
        end_date: "2023-12-31",
        created_at: "2020-01-01T00:00:00Z",
        updated_at: "2020-01-01T00:00:00Z",
        employee: mockEmployees[0]
    },
    {
        id: 2,
        employee_id: 1,
        amount: 25000000,
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        employee: mockEmployees[0]
    },
    {
        id: 3,
        employee_id: 2,
        amount: 12000000,
        start_date: "2020-06-01",
        end_date: "2023-12-31",
        created_at: "2020-06-01T00:00:00Z",
        updated_at: "2020-06-01T00:00:00Z",
        employee: mockEmployees[1]
    },
    {
        id: 4,
        employee_id: 2,
        amount: 15000000,
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        employee: mockEmployees[1]
    }
]

// Mock Financial Performance - Artivity Printing Company
export const mockFinancialPerformance: FinancialPerformance[] = [
    {
        period: "2024-01",
        net_income: 25000000,
        total_assets: 750000000,
        total_equity: 500000000,
        operating_income: 30000000,
        ebitda: 35000000,
        revenue: 80000000,
        gross_profit: 60000000,
        interest_expense: 2000000,
        tax_expense: 5000000,
        depreciation_amortization: 5000000
    },
    {
        period: "2024-02",
        net_income: 28000000,
        total_assets: 780000000,
        total_equity: 520000000,
        operating_income: 32000000,
        ebitda: 37000000,
        revenue: 85000000,
        gross_profit: 63000000,
        interest_expense: 2000000,
        tax_expense: 5500000,
        depreciation_amortization: 5000000
    },
    {
        period: "2024-03",
        net_income: 32000000,
        total_assets: 800000000,
        total_equity: 540000000,
        operating_income: 38000000,
        ebitda: 42000000,
        revenue: 95000000,
        gross_profit: 70000000,
        interest_expense: 2000000,
        tax_expense: 6000000,
        depreciation_amortization: 5000000
    }
]

// Mock Balance Sheet - Artivity Printing Company
export const mockBalanceSheet: BalanceSheetSnapshot[] = [
    {
        period: "2024-03",
        current_assets: 150000000,
        current_liabilities: 50000000,
        total_assets: 800000000,
        total_liabilities: 260000000,
        total_equity: 540000000,
        cash_equivalents: 80000000,
        inventory: 20000000,
        accounts_receivable: 30000000,
        accounts_payable: 25000000,
        short_term_debt: 15000000,
        long_term_debt: 200000000
    }
]

// Mock Cash Conversion Data - Artivity Printing Company
export const mockCashConversionData: CashConversionData[] = [
    {
        period: "2024-03",
        dio: 30,
        dso: 25,
        dpo: 20,
        ccc: 35,
        average_inventory: 20000000,
        cost_of_goods_sold: 25000000,
        credit_sales: 95000000
    }
]

// Mock Valuation Inputs - Artivity Printing Company
export const mockValuationInputs: ValuationInputs = {
    market_cap: 2000000000,
    total_debt: 260000000,
    cash_equivalents: 80000000,
    tax_rate: 0.25,
    cost_of_equity: 0.12,
    cost_of_debt: 0.06,
    beta: 1.2,
    risk_free_rate: 0.03,
    market_risk_premium: 0.07
}

// Mock Financial Ratios - Artivity Printing Company
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

// Mock DuPont Analysis - Artivity Printing Company
export const mockDuPontAnalysis: DuPontAnalysis = {
    roe: 0.059,
    net_profit_margin: 0.34,
    asset_turnover: 0.12,
    equity_multiplier: 1.48,
    profit_margin_contribution: 0.34,
    asset_efficiency_contribution: 0.12,
    leverage_contribution: 1.48
}
