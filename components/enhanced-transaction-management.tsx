"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Plus,
  Search,
  Save,
  Copy,
  Edit,
  Trash2,
  Camera,
  Zap,
  Lock,
  ChevronDown,
  ChevronRight,
  Eye,
  Moon,
  Sun,
  Mic,
  Target,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lightbulb,
} from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts"

interface Transaction {
  id: number
  type: "income" | "expense"
  method: "sales" | "capex" | "opex"
  category_id: number
  project_id?: number
  tag_id?: number
  amount: number
  description: string
  notes?: string
  receipt_url?: string
  date: string
  created_at: string
  updated_at: string
  is_locked?: boolean
  is_biggest?: boolean
}

interface TransactionTemplate {
  id: number
  name: string
  type: "income" | "expense"
  method: "sales" | "capex" | "opex"
  category_id: number
  amount?: number
  description: string
  notes?: string
  frequency: "harian" | "mingguan" | "bulanan"
  last_used?: string
}

interface DailySummary {
  date: string
  totalIncome: number
  totalExpense: number
  netCashFlow: number
  transactionCount: number
}

export function EnhancedTransactionManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [filterPeriod, setFilterPeriod] = useState("today")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [showBalanceCheck, setShowBalanceCheck] = useState(false)
  const [showLockedTransactions, setShowLockedTransactions] = useState(true)
  const [filterMethod, setFilterMethod] = useState<string>("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false)
  const [monthlyTarget, setMonthlyTarget] = useState(25000000) // Target bulanan: Rp 25.000.000

  // Enhanced transaction data with new fields - Localized to Bahasa Indonesia
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Today's transactions
    {
      id: 1,
      type: "income",
      method: "sales",
      category_id: 1,
      tag_id: 1,
      amount: 7500000,
      description: "DP branding restoran seafood",
      notes: "Pelanggan bayar 50% dari total Rp 15 juta",
      receipt_url: "/receipts/receipt-001.jpg",
      date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_locked: false,
      is_biggest: true,
    },
    {
      id: 2,
      type: "expense",
      method: "opex",
      category_id: 4,
      tag_id: 2,
      amount: 1200000,
      description: "Beli kertas art paper 150gsm",
      notes: "Untuk proyek brosur dan katalog, stok 2 minggu",
      date: new Date().toISOString().split("T")[0],
      created_at: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
      updated_at: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
      is_locked: false,
      is_biggest: false,
    },
    {
      id: 3,
      type: "income",
      method: "sales",
      category_id: 2,
      tag_id: 4,
      amount: 3200000,
      description: "Cetak banner promosi grand opening",
      notes: "Banner 4x6m, bahan flexi korea, 3 pcs",
      date: new Date().toISOString().split("T")[0],
      created_at: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
      updated_at: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
      is_locked: false,
      is_biggest: false,
    },
    {
      id: 4,
      type: "expense",
      method: "opex",
      category_id: 7,
      tag_id: 3,
      amount: 450000,
      description: "Bayar token listrik",
      notes: "Token listrik untuk workshop produksi",
      date: new Date().toISOString().split("T")[0],
      created_at: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
      updated_at: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
      is_locked: false,
      is_biggest: false,
    },
    {
      id: 5,
      type: "income",
      method: "sales",
      category_id: 3,
      tag_id: 5,
      amount: 4800000,
      description: "Pelunasan kaos polo komunitas",
      notes: "50 pcs kaos polo, sablon 2 warna + bordir",
      date: new Date().toISOString().split("T")[0],
      created_at: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
      updated_at: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
      is_locked: false,
      is_biggest: false,
    },

    // Yesterday's transactions
    {
      id: 6,
      type: "income",
      method: "sales",
      category_id: 1,
      tag_id: 4,
      amount: 12000000,
      description: "Paket branding UMKM makanan",
      notes: "Logo, kemasan, banner, kartu nama, stiker",
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      is_locked: true,
      is_biggest: true,
    },
    {
      id: 7,
      type: "expense",
      method: "opex",
      category_id: 6,
      tag_id: 6,
      amount: 800000,
      description: "Boost post Instagram",
      notes: "Promosi portfolio branding UMKM",
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      is_locked: true,
      is_biggest: false,
    },
    {
      id: 8,
      type: "expense",
      method: "opex",
      category_id: 4,
      tag_id: 2,
      amount: 2500000,
      description: "Beli kain cotton combed 30s",
      notes: "Untuk produksi kaos komunitas dan seragam",
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      is_locked: true,
      is_biggest: false,
    },

    // Day before yesterday
    {
      id: 9,
      type: "expense",
      method: "capex",
      category_id: 5,
      tag_id: 2,
      amount: 6500000,
      description: "Service mesin cutting sticker",
      notes: "Ganti blade dan kalibrasi mesin Cameo 4",
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      is_locked: true,
      is_biggest: true,
    },
    {
      id: 10,
      type: "income",
      method: "sales",
      category_id: 2,
      tag_id: 1,
      amount: 5500000,
      description: "Cetak undangan pernikahan premium",
      notes: "300 pcs undangan dengan emboss dan foil",
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      is_locked: true,
      is_biggest: false,
    },

    // Weekly transactions for better insights
    {
      id: 11,
      type: "expense",
      method: "opex",
      category_id: 8,
      tag_id: 7,
      amount: 33200000,
      description: "Gaji karyawan bulan Maret",
      notes: "5 karyawan tetap + 2 freelancer",
      date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      is_locked: true,
      is_biggest: true,
    },
    {
      id: 12,
      type: "income",
      method: "sales",
      category_id: 1,
      tag_id: 1,
      amount: 18000000,
      description: "Branding lengkap PT Teknologi Maju",
      notes: "Logo, website, merchandise, seragam",
      date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split("T")[0],
      created_at: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
      updated_at: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
      is_locked: true,
      is_biggest: true,
    },
  ])

  // Transaction templates for recurring entries - Localized to Bahasa Indonesia
  const [templates, setTemplates] = useState<TransactionTemplate[]>([
    {
      id: 1,
      name: "Tagihan Listrik Bulanan",
      type: "expense",
      method: "opex",
      category_id: 7,
      amount: 450000,
      description: "Bayar token listrik workshop",
      notes: "Token listrik bulanan untuk area produksi",
      frequency: "bulanan",
      last_used: "2024-03-01",
    },
    {
      id: 2,
      name: "Stok Kertas Mingguan",
      type: "expense",
      method: "opex",
      category_id: 4,
      amount: 1200000,
      description: "Beli kertas art paper dan HVS",
      notes: "Supplier langganan - Toko Kertas Jaya",
      frequency: "mingguan",
      last_used: "2024-03-15",
    },
    {
      id: 3,
      name: "Paket Desain Logo Standar",
      type: "income",
      method: "sales",
      category_id: 1,
      amount: 2500000,
      description: "Paket desain logo + kartu nama",
      frequency: "harian",
      last_used: "2024-03-20",
    },
    {
      id: 4,
      name: "Gaji Karyawan Bulanan",
      type: "expense",
      method: "opex",
      category_id: 8,
      amount: 33200000,
      description: "Pembayaran gaji semua karyawan",
      notes: "5 karyawan tetap + 2 freelancer",
      frequency: "bulanan",
      last_used: "2024-03-01",
    },
    {
      id: 5,
      name: "Banner Standar 3x2m",
      type: "income",
      method: "sales",
      category_id: 2,
      amount: 850000,
      description: "Cetak banner flexi korea",
      notes: "Banner ukuran standar, full color",
      frequency: "harian",
      last_used: "2024-03-18",
    },
    {
      id: 6,
      name: "Kaos Polo Custom",
      type: "income",
      method: "sales",
      category_id: 3,
      amount: 125000,
      description: "Kaos polo per pcs",
      notes: "Cotton combed 30s, sablon 1 warna",
      frequency: "harian",
      last_used: "2024-03-17",
    },
    {
      id: 7,
      name: "Internet & Telepon",
      type: "expense",
      method: "opex",
      category_id: 7,
      amount: 350000,
      description: "Bayar internet dan telepon kantor",
      notes: "Paket unlimited 100 Mbps",
      frequency: "bulanan",
      last_used: "2024-03-01",
    },
    {
      id: 8,
      name: "Iklan Facebook Ads",
      type: "expense",
      method: "opex",
      category_id: 6,
      amount: 500000,
      description: "Boost post dan iklan Facebook",
      notes: "Target audience lokal dan UMKM",
      frequency: "mingguan",
      last_used: "2024-03-15",
    },
  ])

  // Auto suggestions based on yesterday's transactions
  const yesterdayTransactions = transactions.filter(
    (t) => t.date === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],
  )

  // Enhanced categories with color coding - Localized to Bahasa Indonesia
  const categories = [
    { id: 1, name: "Jasa Desain", type: "income", color: "bg-blue-500" },
    { id: 2, name: "Jasa Cetak", type: "income", color: "bg-green-500" },
    { id: 3, name: "Jasa Konveksi", type: "income", color: "bg-purple-500" },
    { id: 4, name: "Bahan & Supplies", type: "expense", color: "bg-red-500" },
    { id: 5, name: "Peralatan", type: "expense", color: "bg-orange-500" },
    { id: 6, name: "Marketing", type: "expense", color: "bg-pink-500" },
    { id: 7, name: "Utilitas", type: "expense", color: "bg-yellow-500" },
    { id: 8, name: "Operasional", type: "expense", color: "bg-gray-500" },
  ]

  // Enhanced tags with color coding - Localized to Bahasa Indonesia
  const tags = [
    { id: 1, name: "Penjualan", color: "bg-emerald-500", type: "income" },
    { id: 2, name: "Supplies", color: "bg-red-500", type: "expense" },
    { id: 3, name: "Operasional", color: "bg-blue-500", type: "expense" },
    { id: 4, name: "Proyek", color: "bg-purple-500", type: "income" },
    { id: 5, name: "Bonus", color: "bg-yellow-500", type: "income" },
    { id: 6, name: "Marketing", color: "bg-pink-500", type: "expense" },
    { id: 7, name: "Gaji", color: "bg-orange-500", type: "expense" },
    { id: 8, name: "Cashback", color: "bg-green-500", type: "income" },
  ]

  // Quick entry form state
  const [quickEntry, setQuickEntry] = useState({
    type: "income" as "income" | "expense",
    method: "sales" as "sales" | "capex" | "opex",
    amount: "",
    category_id: 1,
    tag_id: 1,
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + N: Add new transaction
      if (e.shiftKey && e.key === "N") {
        e.preventDefault()
        setIsQuickEntryOpen(true)
      }
      // Shift + F: Focus on date filter
      if (e.shiftKey && e.key === "F") {
        e.preventDefault()
        const dateFilter = document.getElementById("date-filter")
        if (dateFilter) dateFilter.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Trigger confetti when viewing positive cash flow
  useEffect(() => {
    const todaySummary = getDailySummary(new Date().toISOString().split("T")[0])
    if (todaySummary.netCashFlow > 0 && filterPeriod === "today") {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4ade80", "#3b82f6", "#8b5cf6"],
        })
      }, 500)
    }
  }, [filterPeriod])

  // Mark biggest transaction of the day
  useEffect(() => {
    const updatedTransactions = [...transactions]
    const dates = [...new Set(updatedTransactions.map((t) => t.date))]

    dates.forEach((date) => {
      const dayTransactions = updatedTransactions.filter((t) => t.date === date)
      let biggestAmount = 0
      let biggestId = 0

      dayTransactions.forEach((t) => {
        t.is_biggest = false
        if (t.amount > biggestAmount) {
          biggestAmount = t.amount
          biggestId = t.id
        }
      })

      const biggestIndex = updatedTransactions.findIndex((t) => t.id === biggestId)
      if (biggestIndex !== -1) {
        updatedTransactions[biggestIndex].is_biggest = true
      }
    })

    setTransactions(updatedTransactions)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Voice recognition simulation
  const startVoiceRecognition = () => {
    setIsRecording(true)
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceText("Tambah pengeluaran Rp 500 ribu buat beli kain furing")
      setIsRecording(false)

      // Parse the voice command
      setTimeout(() => {
        setQuickEntry({
          ...quickEntry,
          type: "expense",
          method: "opex",
          amount: "500000",
          description: "Beli kain furing",
          category_id: 4, // Bahan & Supplies
        })
        setIsQuickEntryOpen(true)
        setVoiceText("")
      }, 1000)
    }, 2000)
  }

  // Filter transactions based on selected period and other filters
  const getFilteredTransactions = () => {
    let filtered = transactions

    // Date filtering
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekStartStr = weekStart.toISOString().split("T")[0]

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthStartStr = monthStart.toISOString().split("T")[0]

    switch (filterPeriod) {
      case "today":
        filtered = filtered.filter((t) => t.date === todayStr)
        break
      case "yesterday":
        filtered = filtered.filter((t) => t.date === yesterdayStr)
        break
      case "week":
        filtered = filtered.filter((t) => t.date >= weekStartStr)
        break
      case "month":
        filtered = filtered.filter((t) => t.date >= monthStartStr)
        break
      case "custom":
        filtered = filtered.filter((t) => t.date === selectedDate)
        break
    }

    // Other filters
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category_id === Number.parseInt(selectedCategory))
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((t) => t.tag_id === Number.parseInt(selectedTag))
    }

    // Add method filtering
    if (filterMethod !== "all") {
      filtered = filtered.filter((t) => t.method === filterMethod)
    }

    if (!showLockedTransactions) {
      filtered = filtered.filter((t) => !t.is_locked)
    }

    return filtered
  }

  // Calculate daily summary
  const getDailySummary = (date: string): DailySummary => {
    const dayTransactions = transactions.filter((t) => t.date === date)
    const totalIncome = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return {
      date,
      totalIncome,
      totalExpense,
      netCashFlow: totalIncome - totalExpense,
      transactionCount: dayTransactions.length,
    }
  }

  // Get today's summary
  const todaySummary = getDailySummary(new Date().toISOString().split("T")[0])

  // Get monthly insights
  const getMonthlyInsights = () => {
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthStartStr = monthStart.toISOString().split("T")[0]

    const monthTransactions = transactions.filter((t) => t.date >= monthStartStr)
    const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    // Category breakdown
    const categoryBreakdown = categories.map((cat) => {
      const catTransactions = monthTransactions.filter((t) => t.category_id === cat.id)
      const total = catTransactions.reduce((sum, t) => sum + t.amount, 0)
      return { ...cat, total, count: catTransactions.length }
    })

    // Highest spending day
    const dailySummaries = Array.from(new Set(monthTransactions.map((t) => t.date))).map((date) =>
      getDailySummary(date),
    )

    const highestSpendingDay = dailySummaries.reduce(
      (max, day) => (day.totalExpense > max.totalExpense ? day : max),
      dailySummaries[0] || { date: "", totalExpense: 0, totalIncome: 0, netCashFlow: 0, transactionCount: 0 },
    )

    // Most used category
    const mostUsedCategory = categoryBreakdown.reduce(
      (max, cat) => (cat.count > max.count ? cat : max),
      categoryBreakdown[0] || { name: "None", count: 0, total: 0 },
    )

    // Daily trend data for chart
    const dailyTrendData = dailySummaries
      .map((day) => ({
        date: new Date(day.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        income: day.totalIncome,
        expense: day.totalExpense,
        net: day.netCashFlow,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      totalIncome,
      totalExpense,
      netCashFlow: totalIncome - totalExpense,
      categoryBreakdown: categoryBreakdown.filter((cat) => cat.total > 0),
      highestSpendingDay,
      mostUsedCategory,
      transactionCount: monthTransactions.length,
      dailyTrendData,
      targetProgress: (totalIncome / monthlyTarget) * 100,
    }
  }

  const monthlyInsights = getMonthlyInsights()

  // Enhanced KPI calculations like the original
  const filteredTransactions = getFilteredTransactions()
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netCashflow = totalIncome - totalExpense
  const capexTotal = filteredTransactions.filter((t) => t.method === "capex").reduce((sum, t) => sum + t.amount, 0)
  const opexTotal = filteredTransactions.filter((t) => t.method === "opex").reduce((sum, t) => sum + t.amount, 0)
  const salesTotal = filteredTransactions.filter((t) => t.method === "sales").reduce((sum, t) => sum + t.amount, 0)

  // Handle quick entry submission
  const handleQuickEntrySubmit = () => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type: quickEntry.type,
      method: quickEntry.method,
      category_id: quickEntry.category_id,
      tag_id: quickEntry.tag_id,
      amount: Number.parseFloat(quickEntry.amount),
      description: quickEntry.description,
      notes: quickEntry.notes,
      date: quickEntry.date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_locked: false,
      is_biggest: false,
    }

    // Check if this is the biggest transaction of the day
    const dayTransactions = transactions.filter((t) => t.date === quickEntry.date)
    const currentBiggest = dayTransactions.reduce((max, t) => (t.amount > max ? t.amount : max), 0)

    if (Number.parseFloat(quickEntry.amount) > currentBiggest) {
      newTransaction.is_biggest = true
      // Reset other transactions' biggest flag for this day
      const updatedTransactions = transactions.map((t) =>
        t.date === quickEntry.date ? { ...t, is_biggest: false } : t,
      )
      setTransactions([...updatedTransactions, newTransaction])
    } else {
      setTransactions([...transactions, newTransaction])
    }

    setQuickEntry({
      type: "income",
      method: "sales",
      amount: "",
      category_id: 1,
      tag_id: 1,
      description: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsQuickEntryOpen(false)

    // Show confetti for income transactions
    if (quickEntry.type === "income" && Number.parseFloat(quickEntry.amount) > 1000000) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#3b82f6", "#8b5cf6"],
      })
    }
  }

  // Handle template usage
  const useTemplate = useCallback(
    (template: TransactionTemplate) => {
      setQuickEntry({
        type: template.type,
        method: template.method,
        amount: template.amount?.toString() || "",
        category_id: template.category_id,
        tag_id: 1, // Default tag
        description: template.description,
        notes: template.notes || "",
        date: new Date().toISOString().split("T")[0],
      })
      setIsTemplateDialogOpen(false)
      setIsQuickEntryOpen(true)
    },
    [setQuickEntry, setIsQuickEntryOpen, setIsTemplateDialogOpen],
  )

  // Save transaction as template
  const saveAsTemplate = (transaction: Transaction) => {
    const newTemplate: TransactionTemplate = {
      id: Date.now(),
      name: `Template: ${transaction.description}`,
      type: transaction.type,
      method: transaction.method,
      category_id: transaction.category_id,
      amount: transaction.amount,
      description: transaction.description,
      notes: transaction.notes,
      frequency: "harian",
      last_used: new Date().toISOString().split("T")[0],
    }
    setTemplates([...templates, newTemplate])
  }

  // Lock/unlock transaction
  const toggleTransactionLock = (id: number) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, is_locked: !t.is_locked } : t)))
  }

  // Get category info
  const getCategoryInfo = (id: number) => categories.find((c) => c.id === id)
  const getTagInfo = (id?: number) => (id ? tags.find((t) => t.id === id) : undefined)

  // Format currency (Indonesian Rupiah)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp")
  }

  // Group transactions by date
  const groupedTransactions = getFilteredTransactions().reduce(
    (groups, transaction) => {
      const date = transaction.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, Transaction[]>,
  )

  const handleUseTemplate = useCallback(
    (template: TransactionTemplate) => {
      useTemplate(template)
    },
    [useTemplate],
  )

  const handleTemplateUsage = useCallback(
    (template: TransactionTemplate) => {
      useTemplate(template)
    },
    [useTemplate],
  )

  // Use yesterday's transaction
  const useYesterdayTransaction = (transaction: Transaction) => {
    setQuickEntry({
      type: transaction.type,
      method: transaction.method,
      amount: transaction.amount.toString(),
      category_id: transaction.category_id,
      tag_id: transaction.tag_id || 1,
      description: transaction.description,
      notes: transaction.notes || "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowAutoSuggestions(false)
    setIsQuickEntryOpen(true)
  }

  useEffect(() => {
    setMonthlyTarget(75000000)
  }, [])

  return (
    <div className={`space-y-6 ${isDarkMode ? "dark" : ""}`}>
      {/* Dark Mode Toggle */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)} className="gap-2">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDarkMode ? "Mode Terang" : "Mode Gelap"}
        </Button>
      </div>

      {/* Daily Summary Widget - Sticky */}
      <Card className="sticky top-0 z-10 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gradient-to-r dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Ringkasan Arus Kas Hari Ini</CardTitle>
            <div className="text-2xl">{todaySummary.netCashFlow >= 0 ? "🟢" : "🔴"}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(todaySummary.totalIncome)}
              </div>
              <div className="text-sm text-muted-foreground">Total Pemasukan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(todaySummary.totalExpense)}
              </div>
              <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${todaySummary.netCashFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatCurrency(todaySummary.netCashFlow)}
              </div>
              <div className="text-sm text-muted-foreground">Arus Kas Bersih</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{todaySummary.transactionCount}</div>
              <div className="text-sm text-muted-foreground">Transaksi</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50/50 dark:bg-blue-900/30 rounded-b-lg border-t border-blue-100 dark:border-blue-800">
          <div className="w-full text-center text-sm">
            {todaySummary.netCashFlow >= 0 ? (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>
                  Hari ini kamu menghabiskan {formatCurrency(todaySummary.totalExpense)} dan menghasilkan{" "}
                  {formatCurrency(todaySummary.totalIncome)}.
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {" "}
                    Untung bersih: {formatCurrency(todaySummary.netCashFlow)} 🎯
                  </span>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>
                  Hari ini kamu menghabiskan {formatCurrency(todaySummary.totalExpense)} dan menghasilkan{" "}
                  {formatCurrency(todaySummary.totalIncome)}.
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {" "}
                    Rugi bersih: {formatCurrency(Math.abs(todaySummary.netCashFlow))} 📉
                  </span>
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Target Progress */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:bg-gradient-to-r dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              Target Bulanan
            </CardTitle>
            <Badge variant={monthlyInsights.targetProgress >= 100 ? "default" : "outline"} className="gap-1">
              {monthlyInsights.targetProgress.toFixed(0)}%{monthlyInsights.targetProgress >= 100 ? " 🎉" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={monthlyInsights.targetProgress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span>Pemasukan: {formatCurrency(monthlyInsights.totalIncome)}</span>
              <span>Target: {formatCurrency(monthlyTarget)}</span>
            </div>
            <div className="text-center text-sm font-medium mt-1">
              {monthlyInsights.targetProgress < 50 ? (
                <span className="text-amber-600 dark:text-amber-400">
                  Pemasukan bulan ini baru mencapai {monthlyInsights.targetProgress.toFixed(0)}% dari target bulanan 🎯
                </span>
              ) : monthlyInsights.targetProgress < 100 ? (
                <span className="text-blue-600 dark:text-blue-400">
                  Pemasukan bulan ini sudah mencapai {monthlyInsights.targetProgress.toFixed(0)}% dari target bulanan 🎯
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400">
                  Selamat! Target bulanan tercapai {monthlyInsights.targetProgress.toFixed(0)}% 🎉
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Financial Summary */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:bg-gradient-to-r dark:from-purple-950 dark:to-indigo-950 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-lg">
            Ringkasan Keuangan (
            {filterPeriod === "today"
              ? "Hari Ini"
              : filterPeriod === "yesterday"
                ? "Kemarin"
                : filterPeriod === "week"
                  ? "Minggu Ini"
                  : filterPeriod === "month"
                    ? "Bulan Ini"
                    : "Kustom"}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(salesTotal)}</div>
              <div className="text-sm text-muted-foreground">💰 Penjualan</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(opexTotal)}</div>
              <div className="text-sm text-muted-foreground">🔧 OPEX</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(capexTotal)}</div>
              <div className="text-sm text-muted-foreground">🏗️ CAPEX</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpense)}</div>
              <div className="text-sm text-muted-foreground">💸 Total Pengeluaran</div>
            </div>
            <div className="text-center">
              <div
                className={`text-xl font-bold ${netCashflow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatCurrency(netCashflow)}
              </div>
              <div className="text-sm text-muted-foreground">📊 Arus Kas Bersih</div>
            </div>
          </div>

          {/* Profit Margin and Ratios */}
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {totalIncome > 0 ? ((netCashflow / totalIncome) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Margin Keuntungan</div>
            </div>
            <div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {totalExpense > 0 ? ((opexTotal / totalExpense) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Rasio OPEX</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {totalExpense > 0 ? ((capexTotal / totalExpense) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Rasio CAPEX</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Transaction Management */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">📊 Transaksi Harian</TabsTrigger>
          <TabsTrigger value="templates">📋 Template</TabsTrigger>
          <TabsTrigger value="insights">📈 Wawasan Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Enhanced Filters and Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manajemen Transaksi</CardTitle>
                  <CardDescription>Pembukuan harian dan pelacakan arus kas</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() => setShowAutoSuggestions(!showAutoSuggestions)}
                        >
                          <Lightbulb className="w-4 h-4" />
                          Saran
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lihat transaksi kemarin untuk entri cepat</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="gap-2" onClick={() => setIsTemplateDialogOpen(true)}>
                          <Copy className="w-4 h-4" />
                          Dari Template
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gunakan template transaksi (Shift+T)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={startVoiceRecognition}
                          disabled={isRecording}
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? "text-red-500 animate-pulse" : ""}`} />
                          {isRecording ? "Merekam..." : "Suara"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Input transaksi dengan suara</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="gap-2" onClick={() => setIsQuickEntryOpen(true)}>
                          <Zap className="w-4 h-4" />
                          Entri Cepat
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tambah transaksi baru (Shift+N)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Voice recognition result */}
              {voiceText && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Terdeteksi: "{voiceText}"</span>
                  </div>
                </div>
              )}

              {/* Auto suggestions */}
              {showAutoSuggestions && yesterdayTransactions.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">Transaksi kemarin yang mungkin berulang:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {yesterdayTransactions.slice(0, 3).map((transaction) => (
                      <Button
                        key={transaction.id}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 h-auto py-2"
                        onClick={() => useYesterdayTransaction(transaction)}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <div className="text-left">
                          <div className="font-medium truncate">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(transaction.amount)}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Filter Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari transaksi atau catatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterPeriod} onValueChange={setFilterPeriod} id="date-filter">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">📅 Hari Ini</SelectItem>
                      <SelectItem value="yesterday">⏮️ Kemarin</SelectItem>
                      <SelectItem value="week">📆 Minggu Ini</SelectItem>
                      <SelectItem value="month">🗓️ Bulan Ini</SelectItem>
                      <SelectItem value="custom">🎯 Tanggal Kustom</SelectItem>
                    </SelectContent>
                  </Select>

                  {filterPeriod === "custom" && (
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-[180px]"
                    />
                  )}

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tag</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                            {tag.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterMethod} onValueChange={setFilterMethod}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Metode</SelectItem>
                      <SelectItem value="sales">💰 Penjualan</SelectItem>
                      <SelectItem value="opex">🔧 OPEX</SelectItem>
                      <SelectItem value="capex">🏗️ CAPEX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="balance-check" checked={showBalanceCheck} onCheckedChange={setShowBalanceCheck} />
                    <Label htmlFor="balance-check">💰 Cek Saldo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-locked"
                      checked={showLockedTransactions}
                      onCheckedChange={setShowLockedTransactions}
                    />
                    <Label htmlFor="show-locked">🔒 Tampilkan Terkunci</Label>
                  </div>
                </div>

                {showBalanceCheck && (
                  <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Saldo Berjalan Bulan Ini:</span>
                        <span
                          className={`text-xl font-bold ${monthlyInsights.netCashFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {formatCurrency(monthlyInsights.netCashFlow)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (Math.abs(monthlyInsights.netCashFlow) /
                            Math.max(monthlyInsights.totalIncome, monthlyInsights.totalExpense)) *
                          100
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grouped Transactions by Date */}
          <div className="space-y-4">
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayTransactions]) => {
                const dailySummary = getDailySummary(date)
                const isToday = date === new Date().toISOString().split("T")[0]

                return (
                  <Card
                    key={date}
                    className={isToday ? "border-blue-300 bg-blue-50/30 dark:bg-blue-900/20 dark:border-blue-800" : ""}
                  >
                    <Collapsible defaultOpen={isToday}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
                              <div>
                                <CardTitle className="text-lg">
                                  {new Date(date).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                  {isToday && <Badge className="ml-2">Hari Ini</Badge>}
                                </CardTitle>
                                <CardDescription>
                                  {dayTransactions.length} transaksi • Bersih:{" "}
                                  {formatCurrency(dailySummary.netCashFlow)}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-green-600 dark:text-green-400 font-medium">
                                ↗️ {formatCurrency(dailySummary.totalIncome)}
                              </div>
                              <div className="text-red-600 dark:text-red-400 font-medium">
                                ↘️ {formatCurrency(dailySummary.totalExpense)}
                              </div>
                              <div
                                className={`font-bold ${dailySummary.netCashFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {dailySummary.netCashFlow >= 0 ? "🟢" : "🔴"} {formatCurrency(dailySummary.netCashFlow)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tag</TableHead>
                                <TableHead>Metode</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                                <TableHead>Catatan</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dayTransactions.map((transaction) => {
                                const category = getCategoryInfo(transaction.category_id)
                                const tag = getTagInfo(transaction.tag_id)

                                return (
                                  <TableRow
                                    key={transaction.id}
                                    className={`
                                      ${transaction.is_locked ? "opacity-60" : ""}
                                      ${transaction.is_biggest ? "bg-amber-50/50 dark:bg-amber-900/20" : ""}
                                    `}
                                  >
                                    <TableCell className="font-mono text-sm">
                                      {new Date(transaction.created_at).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {transaction.receipt_url && <Camera className="w-4 h-4 text-blue-500" />}
                                        <span className="font-medium">{transaction.description}</span>
                                        {transaction.is_locked && <Lock className="w-4 h-4 text-gray-400" />}
                                        {transaction.is_biggest && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Badge
                                                  variant="outline"
                                                  className="ml-1 bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800"
                                                >
                                                  <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
                                                  Terbesar
                                                </Badge>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Transaksi terbesar hari ini</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {category && (
                                        <Badge variant="outline" className="gap-1">
                                          <div className={`w-2 h-2 rounded-full ${category.color}`} />
                                          {category.name}
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {tag && (
                                        <Badge variant="secondary" className="gap-1">
                                          <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                                          {tag.name}
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          transaction.method === "sales"
                                            ? "default"
                                            : transaction.method === "capex"
                                              ? "destructive"
                                              : "secondary"
                                        }
                                      >
                                        {transaction.method === "sales"
                                          ? "💰"
                                          : transaction.method === "capex"
                                            ? "🏗️"
                                            : "🔧"}{" "}
                                        {transaction.method.toUpperCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell
                                      className={`text-right font-bold ${
                                        transaction.type === "income"
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {transaction.type === "income" ? "+" : "-"}
                                      {formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                      {transaction.notes && (
                                        <div
                                          className="text-sm text-muted-foreground truncate"
                                          title={transaction.notes}
                                        >
                                          💬 {transaction.notes}
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex justify-center gap-1">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => saveAsTemplate(transaction)}
                                                title="Simpan sebagai Template"
                                              >
                                                <Save className="w-4 h-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Simpan sebagai template</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleTransactionLock(transaction.id)}
                                                title={transaction.is_locked ? "B uka Kunci" : "Kunci"}
                                              >
                                                {transaction.is_locked ? (
                                                  <Lock className="w-4 h-4" />
                                                ) : (
                                                  <Lock className="w-4 h-4 opacity-50" />
                                                )}
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{transaction.is_locked ? "Buka kunci" : "Kunci transaksi"}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <ChevronDown className="w-4 h-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem>
                                              <Edit className="w-4 h-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                              <Copy className="w-4 h-4 mr-2" />
                                              Duplikasi
                                            </DropdownMenuItem>
                                            {transaction.receipt_url && (
                                              <DropdownMenuItem>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Lihat Bukti
                                              </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Hapus
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Transaksi</CardTitle>
              <CardDescription>Template untuk transaksi yang sering berulang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="outline">{template.frequency}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                        {template.amount && (
                          <div
                            className={`font-bold ${template.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {template.type === "income" ? "+" : "-"}
                            {formatCurrency(template.amount)}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={
                              template.method === "sales"
                                ? "default"
                                : template.method === "capex"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {template.method.toUpperCase()}
                          </Badge>
                          <Button size="sm" onClick={() => handleTemplateUsage(template)}>
                            Gunakan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tren Harian Bulan Ini</CardTitle>
                <CardDescription>Pemasukan vs Pengeluaran harian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyInsights.dailyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), ""]}
                        labelFormatter={(label) => `Tanggal: ${label}`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Pemasukan" />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Pengeluaran" />
                      <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Arus Kas Bersih" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Bulan Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Pemasukan:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(monthlyInsights.totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Pengeluaran:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(monthlyInsights.totalExpense)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Arus Kas Bersih:</span>
                    <span
                      className={`font-bold ${monthlyInsights.netCashFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {formatCurrency(monthlyInsights.netCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Transaksi:</span>
                    <span className="font-bold">{monthlyInsights.transactionCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Breakdown Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyInsights.categoryBreakdown.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{formatCurrency(cat.total)}</div>
                        <div className="text-xs text-muted-foreground">{cat.count} transaksi</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Statistik Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(monthlyInsights.totalIncome / monthlyInsights.transactionCount || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rata-rata per Transaksi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {new Date(monthlyInsights.highestSpendingDay.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">Hari Pengeluaran Tertinggi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {monthlyInsights.mostUsedCategory.name}
                    </div>
                    <div className="text-sm text-muted-foreground">Kategori Tersering</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {monthlyInsights.totalIncome > 0
                        ? ((monthlyInsights.netCashFlow / monthlyInsights.totalIncome) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">Margin Keuntungan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Entry Dialog */}
      <Dialog open={isQuickEntryOpen} onOpenChange={setIsQuickEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Entri Transaksi Cepat</DialogTitle>
            <DialogDescription>Tambah transaksi baru dengan cepat</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={quickEntry.type === "income" ? "default" : "outline"}
                onClick={() => setQuickEntry({ ...quickEntry, type: "income", method: "sales" })}
                className="gap-2"
              >
                💰 Pemasukan
              </Button>
              <Button
                variant={quickEntry.type === "expense" ? "default" : "outline"}
                onClick={() => setQuickEntry({ ...quickEntry, type: "expense", method: "opex" })}
                className="gap-2"
              >
                💸 Pengeluaran
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={quickEntry.method === "sales" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickEntry({ ...quickEntry, method: "sales" })}
                disabled={quickEntry.type === "expense"}
              >
                💰 Sales
              </Button>
              <Button
                variant={quickEntry.method === "opex" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickEntry({ ...quickEntry, method: "opex" })}
                disabled={quickEntry.type === "income"}
              >
                🔧 OPEX
              </Button>
              <Button
                variant={quickEntry.method === "capex" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickEntry({ ...quickEntry, method: "capex" })}
                disabled={quickEntry.type === "income"}
              >
                🏗️ CAPEX
              </Button>
            </div>

            <div>
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={quickEntry.amount}
                onChange={(e) => setQuickEntry({ ...quickEntry, amount: e.target.value })}
                className="text-lg font-bold"
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Deskripsi transaksi..."
                value={quickEntry.description}
                onChange={(e) => setQuickEntry({ ...quickEntry, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={quickEntry.category_id.toString()}
                  onValueChange={(value) => setQuickEntry({ ...quickEntry, category_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.type === quickEntry.type)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tag">Tag</Label>
                <Select
                  value={quickEntry.tag_id.toString()}
                  onValueChange={(value) => setQuickEntry({ ...quickEntry, tag_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter((tag) => tag.type === quickEntry.type)
                      .map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                            {tag.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan..."
                value={quickEntry.notes}
                onChange={(e) => setQuickEntry({ ...quickEntry, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={quickEntry.date}
                onChange={(e) => setQuickEntry({ ...quickEntry, date: e.target.value })}
              />
            </div>

            <Button
              onClick={handleQuickEntrySubmit}
              disabled={!quickEntry.amount || !quickEntry.description}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Simpan Transaksi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pilih Template</DialogTitle>
            <DialogDescription>Gunakan template untuk transaksi yang sering berulang</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    <Badge variant="outline">{template.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                    {template.amount && (
                      <div
                        className={`font-bold ${template.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {template.type === "income" ? "+" : "-"}
                        {formatCurrency(template.amount)}
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          template.method === "sales"
                            ? "default"
                            : template.method === "capex"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {template.method.toUpperCase()}
                      </Badge>
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>
                        Gunakan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
