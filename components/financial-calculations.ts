import type {
  FinancialPerformance,
  BalanceSheetSnapshot,
  CashConversionData,
  FinancialRatios,
  DuPontAnalysis,
  ValuationInputs,
} from "../types/financial"

export class FinancialCalculator {
  static calculateFinancialRatios(performance: FinancialPerformance, balance: BalanceSheetSnapshot): FinancialRatios {
    return {
      // Liquidity Ratios
      current_ratio: balance.current_liabilities > 0 ? balance.current_assets / balance.current_liabilities : 0,
      quick_ratio:
        balance.current_liabilities > 0
          ? (balance.current_assets - balance.inventory) / balance.current_liabilities
          : 0,
      cash_ratio: balance.current_liabilities > 0 ? balance.cash_equivalents / balance.current_liabilities : 0,
      operating_cash_flow_ratio:
        balance.current_liabilities > 0 ? performance.operating_income / balance.current_liabilities : 0,

      // Leverage Ratios
      debt_to_equity: balance.total_equity > 0 ? balance.total_liabilities / balance.total_equity : 0,
      debt_ratio: balance.total_assets > 0 ? balance.total_liabilities / balance.total_assets : 0,
      equity_ratio: balance.total_assets > 0 ? balance.total_equity / balance.total_assets : 0,
      interest_coverage:
        performance.interest_expense > 0 ? performance.operating_income / performance.interest_expense : 0,

      // Profitability Ratios
      gross_margin: performance.revenue > 0 ? (performance.gross_profit / performance.revenue) * 100 : 0,
      net_margin: performance.revenue > 0 ? (performance.net_income / performance.revenue) * 100 : 0,
      ebitda_margin: performance.revenue > 0 ? (performance.ebitda / performance.revenue) * 100 : 0,
      roa: balance.total_assets > 0 ? (performance.net_income / balance.total_assets) * 100 : 0,
      roe: balance.total_equity > 0 ? (performance.net_income / balance.total_equity) * 100 : 0,
      roi: performance.revenue > 0 ? (performance.net_income / performance.revenue) * 100 : 0,

      // Efficiency Ratios
      asset_turnover: balance.total_assets > 0 ? performance.revenue / balance.total_assets : 0,
      equity_multiplier: balance.total_equity > 0 ? balance.total_assets / balance.total_equity : 0,

      // Valuation Ratios
      book_value_per_share: 0, // Would need shares outstanding
      earnings_per_share: 0, // Would need shares outstanding
      price_earnings_ratio: 0, // Would need market price
    }
  }

  static calculateCashConversionCycle(data: CashConversionData): CashConversionData {
    const dio = data.cost_of_goods_sold > 0 ? (data.average_inventory / data.cost_of_goods_sold) * 365 : 0
    const dso = data.credit_sales > 0 ? (data.accounts_receivable / data.credit_sales) * 365 : 0
    const dpo = data.cost_of_goods_sold > 0 ? (data.accounts_payable / data.cost_of_goods_sold) * 365 : 0
    const ccc = dio + dso - dpo

    return {
      ...data,
      dio,
      dso,
      dpo,
      ccc,
    }
  }

  static calculateDuPontAnalysis(performance: FinancialPerformance, balance: BalanceSheetSnapshot): DuPontAnalysis {
    const net_profit_margin = performance.revenue > 0 ? performance.net_income / performance.revenue : 0
    const asset_turnover = balance.total_assets > 0 ? performance.revenue / balance.total_assets : 0
    const equity_multiplier = balance.total_equity > 0 ? balance.total_assets / balance.total_equity : 0
    const roe = net_profit_margin * asset_turnover * equity_multiplier

    return {
      roe: roe * 100,
      net_profit_margin: net_profit_margin * 100,
      asset_turnover,
      equity_multiplier,
      profit_margin_contribution: (net_profit_margin * 100) / 3,
      asset_efficiency_contribution: (asset_turnover * 100) / 3,
      leverage_contribution: (equity_multiplier * 100) / 3,
    }
  }

  static calculateWACC(inputs: ValuationInputs): number {
    const equity_value = inputs.market_cap
    const debt_value = inputs.total_debt
    const total_value = equity_value + debt_value

    if (total_value === 0) return 0

    const equity_weight = equity_value / total_value
    const debt_weight = debt_value / total_value

    const cost_of_equity = inputs.cost_of_equity / 100
    const after_tax_cost_of_debt = (inputs.cost_of_debt / 100) * (1 - inputs.tax_rate / 100)

    return (equity_weight * cost_of_equity + debt_weight * after_tax_cost_of_debt) * 100
  }

  static calculateEnterpriseValue(inputs: ValuationInputs): number {
    return inputs.market_cap + inputs.total_debt - inputs.cash_equivalents
  }

  static calculateNetWorkingCapital(balance: BalanceSheetSnapshot): number {
    return balance.current_assets - balance.current_liabilities
  }
}
