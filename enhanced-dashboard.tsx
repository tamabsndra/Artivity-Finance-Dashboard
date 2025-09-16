"use client"

import { useState } from "react"
import {
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  BarChart3,
  PieChart,
  Printer,
  Calculator,
  FileText,
  LineChart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DateRangePicker } from "./components/date-range-picker"
import { TransactionForm } from "./components/transaction-form"
import { AssetManagement } from "./components/asset-management"
import { EmployeeManagement } from "./components/employee-management"
import { InvestorInsights } from "./components/investor-insights"
import { ValuationReadiness } from "./components/valuation-readiness"
import { FinancialForecasting } from "./components/financial-forecasting"
import { ReportGenerator } from "./components/report-generator"
import type { Transaction } from "./types"
import { EnhancedTransactionManagement } from "./components/enhanced-transaction-management"

export default function EnhancedArtivityDashboard() {
  const [dateRange, setDateRange] = useState({
    start: "2024-03-01",
    end: "2024-03-31",
    label: "This Month",
  })

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterMethod, setFilterMethod] = useState<string>("all")

  // Enhanced mock data with more comprehensive information
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Income - Design Services
    {
      id: 1,
      type: "income",
      method: "sales",
      category_id: 1,
      project_id: 1,
      tag_id: 1,
      amount: 15000000,
      description: "Paket branding lengkap PT Maju Bersama",
      date: "2024-03-15",
      created_at: "2024-03-15T10:00:00Z",
      updated_at: "2024-03-15T10:00:00Z",
    },
    {
      id: 2,
      type: "income",
      method: "sales",
      category_id: 1,
      project_id: 2,
      tag_id: 4,
      amount: 8500000,
      description: "Desain kemasan produk UMKM Keripik Manis",
      date: "2024-03-14",
      created_at: "2024-03-14T14:30:00Z",
      updated_at: "2024-03-14T14:30:00Z",
    },
    // Income - Printing Services
    {
      id: 3,
      type: "income",
      method: "sales",
      category_id: 2,
      project_id: 3,
      tag_id: 1,
      amount: 12000000,
      description: "Cetak banner dan spanduk acara HUT RI",
      date: "2024-03-13",
      created_at: "2024-03-13T09:15:00Z",
      updated_at: "2024-03-13T09:15:00Z",
    },
    {
      id: 4,
      type: "income",
      method: "sales",
      category_id: 2,
      project_id: 4,
      tag_id: 2,
      amount: 6500000,
      description: "Cetak undangan pernikahan 500 pcs",
      date: "2024-03-12",
      created_at: "2024-03-12T16:45:00Z",
      updated_at: "2024-03-12T16:45:00Z",
    },
    // Income - Convection Services
    {
      id: 5,
      type: "income",
      method: "sales",
      category_id: 3,
      project_id: 5,
      tag_id: 3,
      amount: 18000000,
      description: "Produksi seragam kantor 100 set",
      date: "2024-03-11",
      created_at: "2024-03-11T11:20:00Z",
      updated_at: "2024-03-11T11:20:00Z",
    },
    // Expenses - Materials & Supplies
    {
      id: 6,
      type: "expense",
      method: "opex",
      category_id: 4,
      project_id: undefined,
      tag_id: 2,
      amount: 3500000,
      description: "Pembelian kertas premium A3 dan A4",
      date: "2024-03-10",
      created_at: "2024-03-10T08:30:00Z",
      updated_at: "2024-03-10T08:30:00Z",
    },
    {
      id: 7,
      type: "expense",
      method: "opex",
      category_id: 4,
      project_id: 5,
      tag_id: 2,
      amount: 4200000,
      description: "Beli kain drill untuk seragam kantor",
      date: "2024-03-09",
      created_at: "2024-03-09T13:45:00Z",
      updated_at: "2024-03-09T13:45:00Z",
    },
    // Expenses - Equipment (CAPEX)
    {
      id: 8,
      type: "expense",
      method: "capex",
      category_id: 5,
      project_id: undefined,
      tag_id: undefined,
      amount: 8500000,
      description: "Upgrade tinta printer dan maintenance",
      date: "2024-03-08",
      created_at: "2024-03-08T10:15:00Z",
      updated_at: "2024-03-08T10:15:00Z",
    },
    // Expenses - Marketing
    {
      id: 9,
      type: "expense",
      method: "opex",
      category_id: 6,
      project_id: undefined,
      tag_id: 6,
      amount: 1500000,
      description: "Iklan Facebook dan Instagram ads",
      date: "2024-03-07",
      created_at: "2024-03-07T15:20:00Z",
      updated_at: "2024-03-07T15:20:00Z",
    },
    // Expenses - Utilities
    {
      id: 10,
      type: "expense",
      method: "opex",
      category_id: 7,
      project_id: undefined,
      tag_id: 3,
      amount: 850000,
      description: "Bayar listrik dan internet bulan Maret",
      date: "2024-03-06",
      created_at: "2024-03-06T09:00:00Z",
      updated_at: "2024-03-06T09:00:00Z",
    },
    // Expenses - Operational (Salaries)
    {
      id: 11,
      type: "expense",
      method: "opex",
      category_id: 8,
      project_id: undefined,
      tag_id: 7,
      amount: 33200000,
      description: "Gaji karyawan bulan Maret",
      date: "2024-03-05",
      created_at: "2024-03-05T08:00:00Z",
      updated_at: "2024-03-05T08:00:00Z",
    },
    // Additional realistic transactions
    {
      id: 12,
      type: "income",
      method: "sales",
      category_id: 1,
      project_id: 6,
      tag_id: 4,
      amount: 5500000,
      description: "Logo dan identitas visual cafe baru",
      date: "2024-03-04",
      created_at: "2024-03-04T14:30:00Z",
      updated_at: "2024-03-04T14:30:00Z",
    },
    {
      id: 13,
      type: "expense",
      method: "opex",
      category_id: 4,
      project_id: 3,
      tag_id: 2,
      amount: 2800000,
      description: "Bahan banner dan spanduk vinyl",
      date: "2024-03-03",
      created_at: "2024-03-03T11:15:00Z",
      updated_at: "2024-03-03T11:15:00Z",
    },
    {
      id: 14,
      type: "income",
      method: "sales",
      category_id: 2,
      project_id: 7,
      tag_id: 1,
      amount: 4200000,
      description: "Cetak brosur dan katalog produk 5000 pcs",
      date: "2024-03-02",
      created_at: "2024-03-02T16:00:00Z",
      updated_at: "2024-03-02T16:00:00Z",
    },
    {
      id: 15,
      type: "expense",
      method: "opex",
      category_id: 8,
      project_id: undefined,
      tag_id: 3,
      amount: 1200000,
      description: "Biaya transportasi dan pengiriman",
      date: "2024-03-01",
      created_at: "2024-03-01T17:30:00Z",
      updated_at: "2024-03-01T17:30:00Z",
    },
  ])

  // Update categories to be more comprehensive and realistic
  const categories = [
    { id: 1, name: "Jasa Desain", type: "income" },
    { id: 2, name: "Jasa Cetak", type: "income" },
    { id: 3, name: "Jasa Konveksi", type: "income" },
    { id: 4, name: "Bahan & Supplies", type: "expense" },
    { id: 5, name: "Peralatan & Maintenance", type: "expense" },
    { id: 6, name: "Marketing & Promosi", type: "expense" },
    { id: 7, name: "Utilitas & Operasional", type: "expense" },
    { id: 8, name: "Gaji & SDM", type: "expense" },
  ]

  const projects = [
    {
      id: 1,
      name: "Branding PT Maju Bersama",
      description: "Paket branding lengkap untuk perusahaan konstruksi",
      start_date: "2024-03-10",
      end_date: "2024-03-20",
    },
    {
      id: 2,
      name: "Kemasan UMKM Keripik Manis",
      description: "Desain kemasan produk keripik singkong",
      start_date: "2024-03-12",
      end_date: "2024-03-18",
    },
    {
      id: 3,
      name: "Banner HUT RI Kelurahan",
      description: "Spanduk dan banner untuk perayaan kemerdekaan",
      start_date: "2024-03-08",
      end_date: "2024-03-15",
    },
    {
      id: 4,
      name: "Undangan Pernikahan Sari & Budi",
      description: "Undangan pernikahan dengan desain elegan",
      start_date: "2024-03-05",
      end_date: "2024-03-15",
    },
    {
      id: 5,
      name: "Seragam PT Teknologi Maju",
      description: "Seragam kantor dengan logo perusahaan",
      start_date: "2024-03-01",
      end_date: "2024-03-20",
    },
    {
      id: 6,
      name: "Branding Cafe Kopi Nusantara",
      description: "Logo dan identitas visual cafe",
      start_date: "2024-02-28",
      end_date: "2024-03-10",
    },
    {
      id: 7,
      name: "Katalog Produk Fashion",
      description: "Brosur dan katalog untuk brand fashion lokal",
      start_date: "2024-02-25",
      end_date: "2024-03-05",
    },
  ]

  // Update tags to be more specific
  const tags = [
    { id: 1, name: "Proyek Besar" },
    { id: 2, name: "Stok Rutin" },
    { id: 3, name: "Operasional" },
    { id: 4, name: "UMKM" },
    { id: 5, name: "Korporat" },
    { id: 6, name: "Digital Marketing" },
    { id: 7, name: "Gaji" },
  ]

  // Enhanced KPI calculations
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    const matchesMethod = filterMethod === "all" || t.method === filterMethod
    const transactionDate = new Date(t.date)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    const matchesDateRange = transactionDate >= startDate && transactionDate <= endDate

    return matchesSearch && matchesType && matchesMethod && matchesDateRange
  })

  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netCashflow = totalIncome - totalExpense

  const capexTotal = filteredTransactions.filter((t) => t.method === "capex").reduce((sum, t) => sum + t.amount, 0)

  const opexTotal = filteredTransactions.filter((t) => t.method === "opex").reduce((sum, t) => sum + t.amount, 0)

  const salesTotal = filteredTransactions.filter((t) => t.method === "sales").reduce((sum, t) => sum + t.amount, 0)

  // Update monthly data to be more realistic
  const monthlyData = [
    { month: "Jan", income: 68000000, expense: 52000000 },
    { month: "Feb", income: 72000000, expense: 48000000 },
    { month: "Mar", income: totalIncome, expense: totalExpense },
    { month: "Apr", income: 75000000, expense: 51000000 },
    { month: "May", income: 82000000, expense: 55000000 },
    { month: "Jun", income: 88000000, expense: 58000000 },
  ]

  const handleTransactionSubmit = (transactionData: Partial<Transaction>) => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...editingTransaction, ...transactionData, updated_at: new Date().toISOString() }
            : t,
        ),
      )
    } else {
      const { id, ...rest } = transactionData as Transaction
      const newTransaction: Transaction = {
        id: Date.now(),
        ...rest,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setTransactions([...transactions, newTransaction])
    }
    setEditingTransaction(null)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsTransactionFormOpen(true)
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const handleExport = (format: string) => {
    console.log(`Exporting dashboard as ${format} for period: ${dateRange.label}`)
    // Enhanced export implementation would go here
  }

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || "Unknown"
  const getProjectName = (id?: number) => (id ? projects.find((p) => p.id === id)?.name : undefined)
  const getTagName = (id?: number) => (id ? tags.find((t) => t.id === id)?.name : undefined)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Artivity</h1>
              <p className="text-sm text-gray-500">Financial Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker onRangeChange={setDateRange} currentRange={dateRange} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="gap-2"
              onClick={() => {
                setEditingTransaction(null)
                setIsTransactionFormOpen(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2">
              <Building2 className="w-4 h-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="w-4 h-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <PieChart className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="investor" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Investor
            </TabsTrigger>
            <TabsTrigger value="valuation" className="gap-2">
              <Calculator className="w-4 h-4" />
              Valuation
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="gap-2">
              <LineChart className="w-4 h-4" />
              Forecasting
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{dateRange.label}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${totalExpense.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{dateRange.label}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netCashflow >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    ${netCashflow.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{dateRange.label}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CAPEX vs OPEX</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-orange-600 font-medium">CAPEX: ${capexTotal.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-600 font-medium">OPEX: ${opexTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {totalIncome > 0 ? ((netCashflow / totalIncome) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">{dateRange.label}</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses Trend</CardTitle>
                  <CardDescription>6-month comparison ({dateRange.label})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end justify-between gap-4 p-4">
                    {monthlyData.map((month, index) => (
                      <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col items-center gap-1 w-full">
                          <div
                            className="bg-green-500 rounded-t w-full transition-all hover:bg-green-600 cursor-pointer"
                            style={{ height: `${(month.income / 60000000) * 200}px` }}
                            title={`Income: $${month.income.toLocaleString()}`}
                          />
                          <div
                            className="bg-red-500 rounded-b w-full transition-all hover:bg-red-600 cursor-pointer"
                            style={{ height: `${(month.expense / 60000000) * 200}px` }}
                            title={`Expense: $${month.expense.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-sm font-medium">{month.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-sm">Expenses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>CAPEX vs OPEX analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-orange-900">CAPEX</h3>
                        <p className="text-sm text-orange-700">Capital Expenditure</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">${capexTotal.toLocaleString()}</div>
                        <div className="text-sm text-orange-600">
                          {totalExpense > 0 ? ((capexTotal / totalExpense) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-blue-900">OPEX</h3>
                        <p className="text-sm text-blue-700">Operating Expenses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">${opexTotal.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">
                          {totalExpense > 0 ? ((opexTotal / totalExpense) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-green-900">Sales Revenue</h3>
                        <p className="text-sm text-green-700">Total Sales Income</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${salesTotal.toLocaleString()}</div>
                        <div className="text-sm text-green-600">
                          {totalIncome > 0 ? ((salesTotal / totalIncome) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities ({dateRange.label})</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCategoryName(transaction.category_id)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Transactions Tab */}
          <TabsContent value="transactions">
            <EnhancedTransactionManagement />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <AssetManagement />
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Performance Analysis</CardTitle>
                <CardDescription>Track profitability and performance by project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Profitability</h3>
                    {projects.map((project) => {
                      const projectTransactions = filteredTransactions.filter((t) => t.project_id === project.id)
                      const projectRevenue = projectTransactions
                        .filter((t) => t.type === "income")
                        .reduce((sum, t) => sum + t.amount, 0)
                      const projectExpenses = projectTransactions
                        .filter((t) => t.type === "expense")
                        .reduce((sum, t) => sum + t.amount, 0)
                      const projectProfit = projectRevenue - projectExpenses
                      const profitMargin = projectRevenue > 0 ? (projectProfit / projectRevenue) * 100 : 0

                      return (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{project.name}</h4>
                              <p className="text-sm text-gray-500">Project ID: {project.id}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">${projectRevenue.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">Revenue</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Profit: ${projectProfit.toLocaleString()}</span>
                            <span
                              className={`text-sm font-medium ${
                                profitMargin >= 50
                                  ? "text-green-600"
                                  : profitMargin >= 25
                                    ? "text-orange-600"
                                    : "text-red-600"
                              }`}
                            >
                              {profitMargin.toFixed(1)}% margin
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Active Projects:</span>
                          <span className="font-medium">{projects.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Project Revenue:</span>
                          <span className="font-medium text-green-600">
                            $
                            {filteredTransactions
                              .filter((t) => t.type === "income" && t.project_id)
                              .reduce((sum, t) => sum + t.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Project Value:</span>
                          <span className="font-medium">
                            $
                            {(
                              filteredTransactions
                                .filter((t) => t.type === "income" && t.project_id)
                                .reduce((sum, t) => sum + t.amount, 0) / projects.length
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Trends</CardTitle>
                  <CardDescription>Advanced analytics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Cash Flow Velocity</h4>
                      <div className="text-2xl font-bold text-blue-600">${(netCashflow / 30).toFixed(0)}/day</div>
                      <p className="text-sm text-blue-700">Average daily cash flow</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Revenue Growth</h4>
                      <div className="text-2xl font-bold text-green-600">+12.5%</div>
                      <p className="text-sm text-green-700">Compared to previous period</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Expense Efficiency</h4>
                      <div className="text-2xl font-bold text-orange-600">
                        {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%
                      </div>
                      <p className="text-sm text-orange-700">Expense to revenue ratio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Insights</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Most Profitable Category:</span>
                      <Badge variant="default">Design Services</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Highest Expense Category:</span>
                      <Badge variant="destructive">Materials & Supplies</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Average Transaction Size:</span>
                      <span className="font-medium">
                        $
                        {filteredTransactions.length > 0
                          ? (
                              filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length
                            ).toLocaleString()
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Transaction Volume:</span>
                      <span className="font-medium">{filteredTransactions.length} transactions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investor Insights Tab */}
          <TabsContent value="investor">
            <InvestorInsights />
          </TabsContent>

          {/* Valuation Readiness Tab */}
          <TabsContent value="valuation">
            <ValuationReadiness />
          </TabsContent>

          {/* Financial Forecasting Tab */}
          <TabsContent value="forecasting">
            <FinancialForecasting />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => {
          setIsTransactionFormOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction || undefined}
        mode={editingTransaction ? "edit" : "create"}
      />
    </div>
  )
}
