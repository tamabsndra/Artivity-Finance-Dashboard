"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Calendar, Settings, LineChart, PieChart, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useFinancialData } from "@/hooks/useFinancialData"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  Area,
  AreaChart,
} from "recharts"

interface ForecastData {
  period: string
  actual_revenue?: number
  forecast_revenue: number
  lower_bound: number
  upper_bound: number
  actual_expense?: number
  forecast_expense: number
  actual_profit?: number
  forecast_profit: number
}

interface ForecastParams {
  periods: number
  growthRate: number
  seasonality: boolean
  confidenceInterval: number
  includeHistorical: boolean
  forecastMethod: "linear" | "exponential" | "moving-average"
}

export function FinancialForecasting() {
  // Use financial data from service
  const { data: financialPerformance, loading: financialLoading } = useFinancialData()

  // Historical data for Artivity Printing Company
  const historicalData = [
    { period: "Jan 2024", revenue: 38000000, expense: 28000000, profit: 10000000 },
    { period: "Feb 2024", revenue: 42000000, expense: 31000000, profit: 11000000 },
    { period: "Mar 2024", revenue: 45750000, expense: 32100000, profit: 13650000 },
    { period: "Apr 2024", revenue: 41000000, expense: 29500000, profit: 11500000 },
    { period: "May 2024", revenue: 48000000, expense: 34000000, profit: 14000000 },
    { period: "Jun 2024", revenue: 52000000, expense: 36500000, profit: 15500000 },
  ]

  const [forecastParams, setForecastParams] = useState<ForecastParams>({
    periods: 6,
    growthRate: 5,
    seasonality: true,
    confidenceInterval: 80,
    includeHistorical: true,
    forecastMethod: "linear",
  })

  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate forecast when parameters change
  useEffect(() => {
    generateForecast()
  }, [forecastParams])

  const generateForecast = () => {
    setIsGenerating(true)

    // In a real app, this would be a more sophisticated forecasting algorithm
    // For this demo, we'll use a simple linear growth model with some randomness

    const newForecastData: ForecastData[] = []

    // Include historical data if selected
    if (forecastParams.includeHistorical) {
      historicalData.forEach((item) => {
        newForecastData.push({
          period: item.period,
          actual_revenue: item.revenue,
          forecast_revenue: item.revenue,
          lower_bound: item.revenue * 0.95,
          upper_bound: item.revenue * 1.05,
          actual_expense: item.expense,
          forecast_expense: item.expense,
          actual_profit: item.profit,
          forecast_profit: item.profit,
        })
      })
    }

    // Generate forecast data using current financial performance
    const currentRevenue = financialPerformance?.total_revenue || historicalData[historicalData.length - 1].revenue
    const currentExpense = financialPerformance?.total_expenses || historicalData[historicalData.length - 1].expense
    let lastRevenue = currentRevenue
    let lastExpense = currentExpense

    // Seasonal factors (simplified)
    const seasonalFactors = [1.0, 0.9, 1.1, 1.0, 0.95, 1.15, 1.2, 0.85, 0.9, 1.05, 1.1, 0.95]

    for (let i = 1; i <= forecastParams.periods; i++) {
      const monthIndex = (historicalData.length + i - 1) % 12
      const seasonalFactor = forecastParams.seasonality ? seasonalFactors[monthIndex] : 1

      // Calculate forecast based on selected method
      let forecastRevenue, forecastExpense

      if (forecastParams.forecastMethod === "exponential") {
        forecastRevenue = lastRevenue * Math.pow(1 + forecastParams.growthRate / 100, i) * seasonalFactor
        forecastExpense = lastExpense * Math.pow(1 + (forecastParams.growthRate - 1) / 100, i) * seasonalFactor
      } else if (forecastParams.forecastMethod === "moving-average") {
        // Simple moving average of last 3 months (simplified)
        const recentRevenues = newForecastData.slice(-3).map((d) => d.forecast_revenue)
        const recentExpenses = newForecastData.slice(-3).map((d) => d.forecast_expense)

        const avgRevenue = recentRevenues.reduce((sum, val) => sum + val, 0) / recentRevenues.length
        const avgExpense = recentExpenses.reduce((sum, val) => sum + val, 0) / recentExpenses.length

        forecastRevenue = avgRevenue * (1 + forecastParams.growthRate / 100) * seasonalFactor
        forecastExpense = avgExpense * (1 + (forecastParams.growthRate - 1) / 100) * seasonalFactor
      } else {
        // Linear growth
        forecastRevenue = lastRevenue * (1 + (forecastParams.growthRate / 100) * i) * seasonalFactor
        forecastExpense = lastExpense * (1 + ((forecastParams.growthRate - 1) / 100) * i) * seasonalFactor
      }

      // Add some randomness for realism
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05)
      forecastRevenue *= randomFactor
      forecastExpense *= randomFactor

      // Calculate confidence interval
      const confidenceFactor = (100 - forecastParams.confidenceInterval) / 100 + 0.05
      const lowerBound = forecastRevenue * (1 - (confidenceFactor * i) / 10)
      const upperBound = forecastRevenue * (1 + (confidenceFactor * i) / 10)

      // Calculate profit
      const forecastProfit = forecastRevenue - forecastExpense

      // Format month
      const date = new Date(2024, historicalData.length + i - 1, 1)
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const period = `${month} ${year}`

      newForecastData.push({
        period,
        forecast_revenue: Math.round(forecastRevenue),
        lower_bound: Math.round(lowerBound),
        upper_bound: Math.round(upperBound),
        forecast_expense: Math.round(forecastExpense),
        forecast_profit: Math.round(forecastProfit),
      })

      // Update last values for next iteration
      lastRevenue = forecastRevenue
      lastExpense = forecastExpense
    }

    setForecastData(newForecastData)
    setIsGenerating(false)
  }

  const handleParamChange = (param: keyof ForecastParams, value: any) => {
    setForecastParams((prev) => ({ ...prev, [param]: value }))
  }

  // Calculate summary metrics
  const lastActualRevenue = historicalData[historicalData.length - 1].revenue
  const lastForecastRevenue = forecastData.length > 0 ? forecastData[forecastData.length - 1].forecast_revenue : 0
  const revenueGrowth = ((lastForecastRevenue - lastActualRevenue) / lastActualRevenue) * 100

  const totalActualRevenue = historicalData.reduce((sum, item) => sum + item.revenue, 0)
  const totalForecastRevenue = forecastData
    .filter((item) => !item.actual_revenue) // Only include pure forecast periods
    .reduce((sum, item) => sum + item.forecast_revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Forecasting</h2>
          <p className="text-muted-foreground">
            Predict future financial performance based on historical data and growth assumptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last Updated: {new Date().toLocaleDateString()}
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Recalculate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalForecastRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Next {forecastParams.periods} months</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={revenueGrowth > 0 ? "default" : "destructive"}>
                {revenueGrowth > 0 ? "+" : ""}
                {revenueGrowth.toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs. current</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{forecastParams.confidenceInterval}%</div>
            <p className="text-xs text-muted-foreground">Confidence interval</p>
            <div className="mt-2">
              <Progress value={forecastParams.confidenceInterval} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Method</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 capitalize">
              {forecastParams.forecastMethod.replace("-", " ")}
            </div>
            <p className="text-xs text-muted-foreground">
              {forecastParams.seasonality ? "With seasonal adjustments" : "Without seasonality"}
            </p>
            <div className="mt-2">
              <Badge variant="outline">Growth Rate: {forecastParams.growthRate}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>Projected revenue with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="upper_bound"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorUpper)"
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower_bound"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorLower)"
                    name="Lower Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual_revenue"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Actual Revenue"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast_revenue"
                    stroke="#0088FE"
                    strokeWidth={2}
                    strokeDasharray={forecastParams.includeHistorical ? "5 5" : "0"}
                    name="Forecast Revenue"
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast Parameters</CardTitle>
            <CardDescription>Adjust parameters to refine forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="periods">Forecast Periods</Label>
                  <span className="text-sm">{forecastParams.periods} months</span>
                </div>
                <Slider
                  id="periods"
                  min={3}
                  max={24}
                  step={3}
                  value={[forecastParams.periods]}
                  onValueChange={(value) => handleParamChange("periods", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="growthRate">Growth Rate</Label>
                  <span className="text-sm">{forecastParams.growthRate}%</span>
                </div>
                <Slider
                  id="growthRate"
                  min={-10}
                  max={20}
                  step={0.5}
                  value={[forecastParams.growthRate]}
                  onValueChange={(value) => handleParamChange("growthRate", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidenceInterval">Confidence Interval</Label>
                  <span className="text-sm">{forecastParams.confidenceInterval}%</span>
                </div>
                <Slider
                  id="confidenceInterval"
                  min={50}
                  max={95}
                  step={5}
                  value={[forecastParams.confidenceInterval]}
                  onValueChange={(value) => handleParamChange("confidenceInterval", value[0])}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seasonality">Apply Seasonality</Label>
                  <Switch
                    id="seasonality"
                    checked={forecastParams.seasonality}
                    onCheckedChange={(checked) => handleParamChange("seasonality", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="includeHistorical">Include Historical Data</Label>
                  <Switch
                    id="includeHistorical"
                    checked={forecastParams.includeHistorical}
                    onCheckedChange={(checked) => handleParamChange("includeHistorical", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forecastMethod">Forecast Method</Label>
                  <Select
                    value={forecastParams.forecastMethod}
                    onValueChange={(value: "linear" | "exponential" | "moving-average") =>
                      handleParamChange("forecastMethod", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Growth</SelectItem>
                      <SelectItem value="exponential">Exponential Growth</SelectItem>
                      <SelectItem value="moving-average">Moving Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="expense">Expense Forecast</TabsTrigger>
          <TabsTrigger value="profit">Profit Forecast</TabsTrigger>
          <TabsTrigger value="data">Forecast Data</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast Analysis</CardTitle>
              <CardDescription>Detailed revenue projections and growth analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual_revenue"
                      name="Actual Revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast_revenue"
                      name="Forecast Revenue"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Average Monthly Revenue</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    $
                    {(totalForecastRevenue / forecastParams.periods).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <p className="text-sm text-blue-700">Projected monthly average</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Cumulative Growth</h4>
                  <div className="text-2xl font-bold text-green-600">{revenueGrowth.toFixed(1)}%</div>
                  <p className="text-sm text-green-700">Over forecast period</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Forecast Reliability</h4>
                  <div className="text-2xl font-bold text-purple-600">{forecastParams.confidenceInterval}%</div>
                  <p className="text-sm text-purple-700">Confidence level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Forecast Analysis</CardTitle>
              <CardDescription>Projected expenses and cost structure analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual_expense"
                      name="Actual Expense"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast_expense"
                      name="Forecast Expense"
                      stroke="#ff0000"
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-4">Expense Growth Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Expense to Revenue Ratio:</span>
                    <span className="font-medium">
                      {(forecastData.length > 0
                        ? (forecastData[forecastData.length - 1].forecast_expense /
                            forecastData[forecastData.length - 1].forecast_revenue) *
                          100
                        : 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expense Growth Rate:</span>
                    <span className="font-medium">{(forecastParams.growthRate - 1).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Optimization Target:</span>
                    <span className="font-medium text-green-600">-2.5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit Forecast Analysis</CardTitle>
              <CardDescription>Projected profit margins and profitability trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual_profit"
                      name="Actual Profit"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast_profit"
                      name="Forecast Profit"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Profit Margin Trend</h4>
                  <div className="space-y-3">
                    {forecastData
                      .filter((_, i) => i % 2 === 0)
                      .slice(-3)
                      .map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.period}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {((item.forecast_profit / item.forecast_revenue) * 100).toFixed(1)}%
                            </span>
                            <Badge variant="outline">
                              {index > 0 &&
                                (item.forecast_profit / item.forecast_revenue >
                                forecastData[index * 2 - 2].forecast_profit /
                                  forecastData[index * 2 - 2].forecast_revenue
                                  ? "↑"
                                  : "↓")}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Profitability Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Average Profit Margin:</span>
                      <span className="font-medium">
                        {(
                          (forecastData
                            .filter((item) => !item.actual_profit)
                            .reduce((sum, item) => sum + item.forecast_profit / item.forecast_revenue, 0) /
                            forecastData.filter((item) => !item.actual_profit).length) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profit Growth Rate:</span>
                      <span className="font-medium">{(forecastParams.growthRate + 1).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Break-even Analysis:</span>
                      <span className="font-medium text-green-600">Profitable</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Forecast Data Table</CardTitle>
                  <CardDescription>Detailed forecast data for analysis and export</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="h-10 px-4 text-left font-medium">Period</th>
                        <th className="h-10 px-4 text-right font-medium">Actual Revenue</th>
                        <th className="h-10 px-4 text-right font-medium">Forecast Revenue</th>
                        <th className="h-10 px-4 text-right font-medium">Lower Bound</th>
                        <th className="h-10 px-4 text-right font-medium">Upper Bound</th>
                        <th className="h-10 px-4 text-right font-medium">Actual Expense</th>
                        <th className="h-10 px-4 text-right font-medium">Forecast Expense</th>
                        <th className="h-10 px-4 text-right font-medium">Forecast Profit</th>
                        <th className="h-10 px-4 text-right font-medium">Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecastData.map((item, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/50"}>
                          <td className="p-2 px-4 border-b">{item.period}</td>
                          <td className="p-2 px-4 text-right border-b">
                            {item.actual_revenue ? `$${item.actual_revenue.toLocaleString()}` : "-"}
                          </td>
                          <td className="p-2 px-4 text-right border-b">${item.forecast_revenue.toLocaleString()}</td>
                          <td className="p-2 px-4 text-right border-b">${item.lower_bound.toLocaleString()}</td>
                          <td className="p-2 px-4 text-right border-b">${item.upper_bound.toLocaleString()}</td>
                          <td className="p-2 px-4 text-right border-b">
                            {item.actual_expense ? `$${item.actual_expense.toLocaleString()}` : "-"}
                          </td>
                          <td className="p-2 px-4 text-right border-b">${item.forecast_expense.toLocaleString()}</td>
                          <td className="p-2 px-4 text-right border-b">${item.forecast_profit.toLocaleString()}</td>
                          <td className="p-2 px-4 text-right border-b">
                            {((item.forecast_profit / item.forecast_revenue) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
