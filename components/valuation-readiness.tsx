"use client"

import { useState } from "react"
import { Calculator, TrendingUp, DollarSign, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FinancialCalculator } from "./financial-calculations"
import type { ValuationInputs } from "../types/financial"

export function ValuationReadiness() {
  const [inputs, setInputs] = useState<ValuationInputs>({
    market_cap: 150000,
    total_debt: 30000,
    cash_equivalents: 15000,
    tax_rate: 25,
    cost_of_equity: 12,
    cost_of_debt: 6,
    beta: 1.2,
    risk_free_rate: 3.5,
    market_risk_premium: 8,
  })

  const [isCalculated, setIsCalculated] = useState(false)

  const handleInputChange = (field: keyof ValuationInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
    setIsCalculated(false)
  }

  const calculateValuation = () => {
    setIsCalculated(true)
  }

  const wacc = FinancialCalculator.calculateWACC(inputs)
  const enterpriseValue = FinancialCalculator.calculateEnterpriseValue(inputs)
  const netDebt = inputs.total_debt - inputs.cash_equivalents
  const equityValue = inputs.market_cap
  const bookValue = 85000 // From balance sheet
  const marketToBook = equityValue / bookValue

  // CAPM Calculation
  const capmCostOfEquity = inputs.risk_free_rate + inputs.beta * inputs.market_risk_premium

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Inputs</CardTitle>
          <CardDescription>Enter key financial metrics for comprehensive valuation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Market Data */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Market Data</h3>
              <div>
                <Label htmlFor="market_cap">Market Capitalization ($)</Label>
                <Input
                  id="market_cap"
                  type="number"
                  value={inputs.market_cap}
                  onChange={(e) => handleInputChange("market_cap", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="beta">Beta (β)</Label>
                <Input
                  id="beta"
                  type="number"
                  step="0.1"
                  value={inputs.beta}
                  onChange={(e) => handleInputChange("beta", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="risk_free_rate">Risk-Free Rate (%)</Label>
                <Input
                  id="risk_free_rate"
                  type="number"
                  step="0.1"
                  value={inputs.risk_free_rate}
                  onChange={(e) => handleInputChange("risk_free_rate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="market_risk_premium">Market Risk Premium (%)</Label>
                <Input
                  id="market_risk_premium"
                  type="number"
                  step="0.1"
                  value={inputs.market_risk_premium}
                  onChange={(e) => handleInputChange("market_risk_premium", e.target.value)}
                />
              </div>
            </div>

            {/* Financial Structure */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Financial Structure</h3>
              <div>
                <Label htmlFor="total_debt">Total Debt ($)</Label>
                <Input
                  id="total_debt"
                  type="number"
                  value={inputs.total_debt}
                  onChange={(e) => handleInputChange("total_debt", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cash_equivalents">Cash & Equivalents ($)</Label>
                <Input
                  id="cash_equivalents"
                  type="number"
                  value={inputs.cash_equivalents}
                  onChange={(e) => handleInputChange("cash_equivalents", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.1"
                  value={inputs.tax_rate}
                  onChange={(e) => handleInputChange("tax_rate", e.target.value)}
                />
              </div>
            </div>

            {/* Cost of Capital */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Cost of Capital</h3>
              <div>
                <Label htmlFor="cost_of_equity">Cost of Equity (%)</Label>
                <Input
                  id="cost_of_equity"
                  type="number"
                  step="0.1"
                  value={inputs.cost_of_equity}
                  onChange={(e) => handleInputChange("cost_of_equity", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cost_of_debt">Cost of Debt (%)</Label>
                <Input
                  id="cost_of_debt"
                  type="number"
                  step="0.1"
                  value={inputs.cost_of_debt}
                  onChange={(e) => handleInputChange("cost_of_debt", e.target.value)}
                />
              </div>
              <div className="pt-4">
                <Button onClick={calculateValuation} className="w-full gap-2">
                  <Calculator className="w-4 h-4" />
                  Calculate Valuation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isCalculated && (
        <>
          {/* Key Valuation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WACC</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{wacc.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">Weighted Average Cost of Capital</p>
                <div className="mt-2">
                  <Badge variant={wacc < 10 ? "default" : "secondary"}>{wacc < 10 ? "Competitive" : "Monitor"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enterprise Value</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${enterpriseValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Company Value</p>
                <div className="mt-2">
                  <Badge variant="default">EV = Equity + Net Debt</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equity Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${equityValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Shareholder Value</p>
                <div className="mt-2">
                  <Badge variant="outline">Market Cap</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market-to-Book</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{marketToBook.toFixed(1)}x</div>
                <p className="text-xs text-muted-foreground">Market vs Book Value</p>
                <div className="mt-2">
                  <Badge variant={marketToBook > 1.5 ? "default" : "secondary"}>
                    {marketToBook > 1.5 ? "Premium" : "Discount"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Calculations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>WACC Calculation Breakdown</CardTitle>
                <CardDescription>Weighted Average Cost of Capital components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Formula: WACC = (E/V × Re) + (D/V × Rd × (1-T))</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Equity Value (E):</span>
                        <span className="font-medium">${equityValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt Value (D):</span>
                        <span className="font-medium">${inputs.total_debt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Value (V):</span>
                        <span className="font-medium">${(equityValue + inputs.total_debt).toLocaleString()}</span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between">
                        <span>Equity Weight:</span>
                        <span className="font-medium">
                          {((equityValue / (equityValue + inputs.total_debt)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt Weight:</span>
                        <span className="font-medium">
                          {((inputs.total_debt / (equityValue + inputs.total_debt)) * 100).toFixed(1)}%
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between">
                        <span>Cost of Equity:</span>
                        <span className="font-medium">{inputs.cost_of_equity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>After-tax Cost of Debt:</span>
                        <span className="font-medium">
                          {(inputs.cost_of_debt * (1 - inputs.tax_rate / 100)).toFixed(2)}%
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between font-bold text-blue-600">
                        <span>WACC:</span>
                        <span>{wacc.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">CAPM Cost of Equity Check</h4>
                    <div className="text-sm text-blue-800">
                      <p>Re = Rf + β(Rm - Rf)</p>
                      <p>
                        Re = {inputs.risk_free_rate}% + {inputs.beta} × {inputs.market_risk_premium}% ={" "}
                        {capmCostOfEquity.toFixed(2)}%
                      </p>
                      <p className="mt-2">
                        {Math.abs(capmCostOfEquity - inputs.cost_of_equity) < 1
                          ? "✅ Cost of equity is consistent with CAPM"
                          : "⚠️ Consider adjusting cost of equity to align with CAPM"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valuation Summary</CardTitle>
                <CardDescription>Key valuation metrics and multiples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">Enterprise Valuation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Enterprise Value:</span>
                        <span className="font-medium">${enterpriseValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EV/Revenue (TTM):</span>
                        <span className="font-medium">{(enterpriseValue / 183000).toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EV/EBITDA (TTM):</span>
                        <span className="font-medium">{(enterpriseValue / 91200).toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-3">Equity Valuation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Market Capitalization:</span>
                        <span className="font-medium">${equityValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Book Value:</span>
                        <span className="font-medium">${bookValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market-to-Book Ratio:</span>
                        <span className="font-medium">{marketToBook.toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-3">Financial Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Net Debt:</span>
                        <span className="font-medium">${netDebt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt-to-Equity:</span>
                        <span className="font-medium">{(inputs.total_debt / equityValue).toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt-to-Enterprise Value:</span>
                        <span className="font-medium">{((inputs.total_debt / enterpriseValue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Valuation Health Check</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={wacc < 12 ? "text-green-600" : "text-orange-600"}>
                          {wacc < 12 ? "✅" : "⚠️"}
                        </span>
                        <span>WACC is {wacc < 12 ? "competitive" : "high"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={marketToBook > 1 ? "text-green-600" : "text-red-600"}>
                          {marketToBook > 1 ? "✅" : "❌"}
                        </span>
                        <span>Trading at {marketToBook > 1 ? "premium" : "discount"} to book value</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={netDebt < equityValue * 0.5 ? "text-green-600" : "text-orange-600"}>
                          {netDebt < equityValue * 0.5 ? "✅" : "⚠️"}
                        </span>
                        <span>Debt level is {netDebt < equityValue * 0.5 ? "conservative" : "moderate"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
