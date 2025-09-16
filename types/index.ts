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
}

export interface Category {
  id: number
  name: string
  type: "income" | "expense"
}

export interface Project {
  id: number
  name: string
  description: string
  start_date: string
  end_date?: string
}

export interface Tag {
  id: number
  name: string
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
}

export interface Employee {
  id: number
  name: string
  position: string
  type: "full-time" | "freelance" | "contract"
  current_salary?: number
}

export interface SalaryHistory {
  id: number
  employee_id: number
  amount: number
  start_date: string
  end_date?: string
}

export interface DateRange {
  start: string
  end: string
  label: string
}
