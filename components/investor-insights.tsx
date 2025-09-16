"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FinancialCalculator } from "./financial-calculations"
import { useFinancialData } from "@/hooks/useFinancialData"
import type { FinancialPerformance, BalanceSheetSnapshot, CashConversionData } from "@/types/financial"

export function InvestorInsights() {
  // Use financial data from service
  const { data: financialPerformance, loading: financialLoading } = useFinancialData()

  // Fallback financial data for Artivity Printing Company
  const financialData = financialPerformance || {
    period: "2024-Q1",
    net_income: 13650000,
    total_assets: 125000000,
    total_equity: 85000000,
    operating_income: 18500000,
    ebitda: 22800000,
    revenue: 45750000,
    gross_profit: 28500000,
    interest_expense: 1200000,
    tax_expense: 3650000,
    depreciation_amortization: 4300000,
  }

  const [balanceData] = useState<BalanceSheetSnapshot>({
    period: "2024-Q1",
    current_assets: 45000000,
    current_liabilities: 18000000,
    total_assets: 125000000,
    total_liabilities: 40000000,
    total_equity: 85000000,
    cash_equivalents: 15000000,
    inventory: 8500000,
    accounts_receivable: 12000000,
    accounts_payable: 6500000,
    short_term_debt: 5000000,
    long_term_debt: 25000000,
  })

  const [cccData] = useState<CashConversionData>({
    period: "2024-Q1",
    dio: 0,
    dso: 0,
    dpo: 0,
    ccc: 0,
    average_inventory: 8500,
    cost_of_goods_sold: 17250,
    credit_sales: 45750,
    accounts_receivable: 12000,
    accounts_payable: 6500,
  })

  const ratios = FinancialCalculator.calculateFinancialRatios(financialData, balanceData)
  const cccCalculated = FinancialCalculator.calculateCashConversionCycle({
    ...cccData,
    accounts_receivable: balanceData.accounts_receivable,
    accounts_payable: balanceData.accounts_payable,
  })
  const dupontAnalysis = FinancialCalculator.calculateDuPontAnalysis(financialData, balanceData)
  const nwc = FinancialCalculator.calculateNetWorkingCapital(balanceData)

  const getRatioStatus = (value: number, good: number, excellent: number) => {
    if (value >= excellent) return { status: "excellent", color: "text-green-600" }
    if (value >= good) return { status: "good", color: "text-blue-600" }
    return { status: "needs attention", color: "text-red-600" }
  }

  const monthlyTrends = [
    { month: "Jan", ebitda: 18500, roe: 14.2, roa: 9.8, current_ratio: 2.1 },
    { month: "Feb", ebitda: 20100, roe: 15.1, roa: 10.2, current_ratio: 2.3 },
    { month: "Mar", ebitda: 22800, roe: 16.1, roa: 10.9, current_ratio: 2.5 },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          <TabsTrigger value="dupont">DuPont Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        {/* Financial Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Valuation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EBITDA</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${financialData.ebitda.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Margin: {ratios.ebitda_margin.toFixed(1)}%</p>
                <div className="mt-2">
                  <Badge variant="default">Strong</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROE</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{ratios.roe.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Return on Equity</p>
                <div className="mt-2">
                  <Badge variant={ratios.roe > 15 ? "default" : "secondary"}>
                    {ratios.roe > 15 ? "Excellent" : "Good"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROA</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{ratios.roa.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Return on Assets</p>
                <div className="mt-2">
                  <Badge variant={ratios.roa > 10 ? "default" : "secondary"}>
                    {ratios.roa > 10 ? "Strong" : "Moderate"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Working Capital</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${nwc.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Current Assets - Current Liabilities</p>
                <div className="mt-2">
                  <Badge variant={nwc > 20000 ? "default" : "secondary"}>{nwc > 20000 ? "Healthy" : "Monitor"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Conversion Cycle */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Conversion Cycle Analysis</CardTitle>
              <CardDescription>Efficiency in converting inventory and receivables into cash 🔄</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">DIO (Days)</span>
                    <span className="text-sm">{cccCalculated.dio.toFixed(0)}</span>
                  </div>
                  <Progress value={(cccCalculated.dio / 365) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">Days Inventory Outstanding</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">DSO (Days)</span>
                    <span className="text-sm">{cccCalculated.dso.toFixed(0)}</span>
                  </div>
                  <Progress value={(cccCalculated.dso / 365) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">Days Sales Outstanding</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">DPO (Days)</span>
                    <span className="text-sm">{cccCalculated.dpo.toFixed(0)}</span>
                  </div>
                  <Progress value={(cccCalculated.dpo / 365) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">Days Payable Outstanding</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">CCC (Days)</span>
                    <span
                      className={`text-sm font-bold ${cccCalculated.ccc < 30 ? "text-green-600" : cccCalculated.ccc < 60 ? "text-orange-600" : "text-red-600"}`}
                    >
                      {cccCalculated.ccc.toFixed(0)}
                    </span>
                  </div>
                  <Progress value={Math.min((cccCalculated.ccc / 90) * 100, 100)} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {cccCalculated.ccc < 30 ? "Excellent" : cccCalculated.ccc < 60 ? "Good" : "Needs Improvement"}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Cash Conversion Insights</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Lower CCC indicates faster cash flow conversion</p>
                  <p>
                    • Current CCC of {cccCalculated.ccc.toFixed(0)} days means it takes {cccCalculated.ccc.toFixed(0)}{" "}
                    days to convert investments into cash
                  </p>
                  <p>• Target: Keep CCC below 45 days for optimal cash flow</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liquidity & Leverage Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Liquidity Ratios</CardTitle>
                <CardDescription>Ability to meet short-term obligations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Ratio</span>
                    <div className="text-right">
                      <span className={`font-bold ${getRatioStatus(ratios.current_ratio, 1.5, 2.0).color}`}>
                        {ratios.current_ratio.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {getRatioStatus(ratios.current_ratio, 1.5, 2.0).status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Quick Ratio</span>
                    <div className="text-right">
                      <span className={`font-bold ${getRatioStatus(ratios.quick_ratio, 1.0, 1.5).color}`}>
                        {ratios.quick_ratio.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {getRatioStatus(ratios.quick_ratio, 1.0, 1.5).status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Cash Ratio</span>
                    <div className="text-right">
                      <span className={`font-bold ${getRatioStatus(ratios.cash_ratio, 0.2, 0.5).color}`}>
                        {ratios.cash_ratio.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {getRatioStatus(ratios.cash_ratio, 0.2, 0.5).status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leverage Ratios</CardTitle>
                <CardDescription>Financial risk and debt management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Debt-to-Equity</span>
                    <div className="text-right">
                      <span
                        className={`font-bold ${ratios.debt_to_equity < 0.5 ? "text-green-600" : ratios.debt_to_equity < 1.0 ? "text-orange-600" : "text-red-600"}`}
                      >
                        {ratios.debt_to_equity.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {ratios.debt_to_equity < 0.5
                          ? "Conservative"
                          : ratios.debt_to_equity < 1.0
                            ? "Moderate"
                            : "High"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Debt Ratio</span>
                    <div className="text-right">
                      <span
                        className={`font-bold ${ratios.debt_ratio < 0.3 ? "text-green-600" : ratios.debt_ratio < 0.6 ? "text-orange-600" : "text-red-600"}`}
                      >
                        {(ratios.debt_ratio * 100).toFixed(1)}%
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {ratios.debt_ratio < 0.3 ? "Low Risk" : ratios.debt_ratio < 0.6 ? "Moderate Risk" : "High Risk"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Interest Coverage</span>
                    <div className="text-right">
                      <span
                        className={`font-bold ${ratios.interest_coverage > 5 ? "text-green-600" : ratios.interest_coverage > 2.5 ? "text-orange-600" : "text-red-600"}`}
                      >
                        {ratios.interest_coverage.toFixed(1)}x
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {ratios.interest_coverage > 5 ? "Strong" : ratios.interest_coverage > 2.5 ? "Adequate" : "Weak"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Ratios Tab */}
        <TabsContent value="ratios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profitability Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>Profitability Ratios</CardTitle>
                <CardDescription>Earnings efficiency and profitability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Gross Margin</span>
                    <span className="font-medium">{ratios.gross_margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Net Margin</span>
                    <span className="font-medium">{ratios.net_margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">EBITDA Margin</span>
                    <span className="font-medium">{ratios.ebitda_margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROA</span>
                    <span className="font-medium">{ratios.roa.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROE</span>
                    <span className="font-medium">{ratios.roe.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Ratios</CardTitle>
                <CardDescription>Asset and capital utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Asset Turnover</span>
                    <span className="font-medium">{ratios.asset_turnover.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Equity Multiplier</span>
                    <span className="font-medium">{ratios.equity_multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Working Capital Turnover</span>
                    <span className="font-medium">{(financialData.revenue / nwc).toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cash Conversion Cycle</span>
                    <span className="font-medium">{cccCalculated.ccc.toFixed(0)} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>Valuation Metrics</CardTitle>
                <CardDescription>Investment and valuation indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprise Value</span>
                    <span className="font-medium">$145,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Book Value</span>
                    <span className="font-medium">${balanceData.total_equity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">EV/EBITDA</span>
                    <span className="font-medium">{(145000 / financialData.ebitda).toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price/Book</span>
                    <span className="font-medium">1.7x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DuPont Analysis Tab */}
        <TabsContent value="dupont" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DuPont Analysis</CardTitle>
              <CardDescription>Breakdown of Return on Equity (ROE) into its component drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* DuPont Formula Visualization */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                      ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{dupontAnalysis.roe.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">ROE</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-semibold">=</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {dupontAnalysis.net_profit_margin.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Net Margin</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {dupontAnalysis.asset_turnover.toFixed(2)}x
                        </div>
                        <div className="text-xs text-gray-600">Asset Turnover</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">
                          {dupontAnalysis.equity_multiplier.toFixed(2)}x
                        </div>
                        <div className="text-xs text-gray-600">Equity Multiplier</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Component Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">Profitability</CardTitle>
                      <CardDescription>Net Profit Margin</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-green-600">
                          {dupontAnalysis.net_profit_margin.toFixed(1)}%
                        </div>
                        <Progress value={dupontAnalysis.net_profit_margin} className="h-2" />
                        <div className="text-sm text-gray-600">Net Income / Revenue</div>
                        <div className="text-xs text-gray-500">
                          Measures how much profit is generated from each dollar of revenue
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-orange-700">Efficiency</CardTitle>
                      <CardDescription>Asset Turnover</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-orange-600">
                          {dupontAnalysis.asset_turnover.toFixed(2)}x
                        </div>
                        <Progress value={(dupontAnalysis.asset_turnover / 2) * 100} className="h-2" />
                        <div className="text-sm text-gray-600">Revenue / Total Assets</div>
                        <div className="text-xs text-gray-500">
                          Measures how efficiently assets are used to generate revenue
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Leverage</CardTitle>
                      <CardDescription>Equity Multiplier</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-purple-600">
                          {dupontAnalysis.equity_multiplier.toFixed(2)}x
                        </div>
                        <Progress value={(dupontAnalysis.equity_multiplier / 3) * 100} className="h-2" />
                        <div className="text-sm text-gray-600">Total Assets / Total Equity</div>
                        <div className="text-xs text-gray-500">Measures financial leverage and use of debt</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>DuPont Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Profitability Driver</h4>
                        <p className="text-sm text-green-700">
                          Net profit margin of {dupontAnalysis.net_profit_margin.toFixed(1)}% indicates{" "}
                          {dupontAnalysis.net_profit_margin > 20
                            ? "excellent"
                            : dupontAnalysis.net_profit_margin > 10
                              ? "good"
                              : "moderate"}{" "}
                          profitability management.
                        </p>
                      </div>

                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800">Efficiency Driver</h4>
                        <p className="text-sm text-orange-700">
                          Asset turnover of {dupontAnalysis.asset_turnover.toFixed(2)}x shows{" "}
                          {dupontAnalysis.asset_turnover > 1 ? "efficient" : "room for improvement in"} asset
                          utilization.
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800">Leverage Driver</h4>
                        <p className="text-sm text-purple-700">
                          Equity multiplier of {dupontAnalysis.equity_multiplier.toFixed(2)}x indicates{" "}
                          {dupontAnalysis.equity_multiplier < 2
                            ? "conservative"
                            : dupontAnalysis.equity_multiplier < 3
                              ? "moderate"
                              : "aggressive"}{" "}
                          use of financial leverage.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance Trends</CardTitle>
              <CardDescription>Month-over-month financial metrics evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between gap-4 p-4">
                {monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                    <div className="flex flex-col items-center gap-1 w-full">
                      {/* EBITDA Bar */}
                      <div
                        className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600 cursor-pointer"
                        style={{ height: `${(month.ebitda / 25000) * 150}px` }}
                        title={`EBITDA: $${month.ebitda.toLocaleString()}`}
                      />
                      {/* ROE Bar */}
                      <div
                        className="bg-green-500 w-full transition-all hover:bg-green-600 cursor-pointer"
                        style={{ height: `${(month.roe / 20) * 100}px` }}
                        title={`ROE: ${month.roe}%`}
                      />
                      {/* ROA Bar */}
                      <div
                        className="bg-orange-500 w-full transition-all hover:bg-orange-600 cursor-pointer"
                        style={{ height: `${(month.roa / 15) * 80}px` }}
                        title={`ROA: ${month.roa}%`}
                      />
                      {/* Current Ratio Bar */}
                      <div
                        className="bg-purple-500 rounded-b w-full transition-all hover:bg-purple-600 cursor-pointer"
                        style={{ height: `${(month.current_ratio / 3) * 60}px` }}
                        title={`Current Ratio: ${month.current_ratio}`}
                      />
                    </div>
                    <span className="text-sm font-medium">{month.month}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">EBITDA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm">ROE (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span className="text-sm">ROA (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded" />
                  <span className="text-sm">Current Ratio</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+23.5%</div>
                <p className="text-sm text-gray-600">Quarter-over-quarter</p>
                <div className="mt-2">
                  <Badge variant="default">Strong Growth</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EBITDA Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">+18.2%</div>
                <p className="text-sm text-gray-600">Quarter-over-quarter</p>
                <div className="mt-2">
                  <Badge variant="default">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROE Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">+1.9pp</div>
                <p className="text-sm text-gray-600">Percentage points</p>
                <div className="mt-2">
                  <Badge variant="default">Improving</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
