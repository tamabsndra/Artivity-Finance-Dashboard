"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  BarChart3,
  PieChart,
  Calculator,
  FileText,
  Plus
} from "lucide-react"

import { TransactionList } from "@/components/features/TransactionList"
import { useFinancialData } from "@/hooks/useFinancialData"
import { useTransactions } from "@/hooks/useTransactions"
import { formatCurrency, formatPercentage } from "@/utils/formatters"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch financial data
  const { data: financialPerformance, loading: financialLoading } = useFinancialData()
  const { data: balanceSheet } = useFinancialData()
  const { data: financialRatios } = useFinancialData()

  // Fetch recent transactions
  const { transactions: recentTransactions, loading: transactionsLoading } = useTransactions({
    page: 1,
    limit: 5,
    search: "",
    type: undefined,
    method: undefined,
  })

  // Calculate dashboard metrics from real data
  const dashboardMetrics = {
    totalRevenue: financialPerformance?.total_revenue || 0,
    totalExpenses: financialPerformance?.total_expenses || 0,
    netIncome: financialPerformance?.net_income || 0,
    profitMargin: financialPerformance?.profit_margin || 0,
    growthRate: financialPerformance?.growth_rate || 0,
    cashFlow: financialPerformance?.cash_flow || 0,
    assetsValue: balanceSheet?.total_assets || 0,
    liabilitiesValue: balanceSheet?.total_liabilities || 0,
    equityValue: balanceSheet?.total_equity || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Artivity Printing</h1>
          <p className="text-gray-600 mt-2">
            Platform manajemen keuangan dan analitik untuk perusahaan percetakan
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {financialLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(dashboardMetrics.totalRevenue)}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{formatPercentage(dashboardMetrics.growthRate)} dari bulan lalu
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan Bersih</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {financialLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dashboardMetrics.netIncome)}
                  </div>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatPercentage(dashboardMetrics.profitMargin)} margin keuntungan
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {financialLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(dashboardMetrics.assetsValue)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(dashboardMetrics.equityValue)} ekuitas
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arus Kas</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              {financialLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(dashboardMetrics.cashFlow)}
                  </div>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Arus kas positif
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
            <TabsTrigger value="forecasting">Peramalan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Transaksi Terbaru
                  </CardTitle>
                  <CardDescription>
                    Entri pendapatan dan pengeluaran terbaru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTransactions && recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${
                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                              }`}>
                                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-xs text-gray-500">{transaction.type}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Tidak ada transaksi terbaru</p>
                        </div>
                      )}
                    </div>
                  )}
                  <Button className="w-full mt-4" variant="outline">
                    Lihat Semua Transaksi
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Ratios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Rasio Keuangan Utama
                  </CardTitle>
                  <CardDescription>
                    Indikator kesehatan keuangan penting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Rasio Lancar</span>
                      <span className="font-bold text-green-600">
                        {financialRatios?.current_ratio ? financialRatios.current_ratio.toFixed(1) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Debt-to-Equity</span>
                      <span className="font-bold text-blue-600">
                        {financialRatios?.debt_to_equity ? financialRatios.debt_to_equity.toFixed(2) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ROE</span>
                      <span className="font-bold text-purple-600">
                        {financialRatios?.roe ? formatPercentage(financialRatios.roe) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Margin Kotor</span>
                      <span className="font-bold text-orange-600">
                        {financialRatios?.gross_margin ? formatPercentage(financialRatios.gross_margin) : "N/A"}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Lihat Rasio Detail
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Tugas dan operasi umum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="h-6 w-6 mb-2" />
                    Tambah Transaksi
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <PieChart className="h-6 w-6 mb-2" />
                    Lihat Laporan
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Analitik
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Ekspor Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList
              onAddTransaction={() => console.log("Add transaction")}
              onEditTransaction={(transaction) => console.log("Edit transaction", transaction)}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analitik & Wawasan</CardTitle>
                <CardDescription>
                  Analitik keuangan lanjutan dan tren
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analitik Segera Hadir</h3>
                  <p className="text-gray-500">
                    Analitik lanjutan dan wawasan akan tersedia di sini.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Keuangan</CardTitle>
                <CardDescription>
                  Buat dan ekspor laporan keuangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Laporan Segera Hadir</h3>
                  <p className="text-gray-500">
                    Pembuatan laporan keuangan akan tersedia di sini.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting">
            <Card>
              <CardHeader>
                <CardTitle>Peramalan Keuangan</CardTitle>
                <CardDescription>
                  Prediksi dan perencanaan keuangan berbasis AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Peramalan Segera Hadir</h3>
                  <p className="text-gray-500">
                    Peramalan keuangan berbasis AI akan tersedia di sini.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
