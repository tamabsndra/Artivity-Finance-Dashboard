"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download } from "lucide-react"
import { useTransactions, useTransactionSummary } from "@/hooks/useTransactions"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { TRANSACTION_TYPES, TRANSACTION_METHODS } from "@/constants"
import type { TransactionFilters } from "@/types/api"

interface TransactionListProps {
  onAddTransaction?: () => void
  onEditTransaction?: (transaction: any) => void
}

export function TransactionList({ onAddTransaction, onEditTransaction }: TransactionListProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    search: "",
    type: undefined,
    method: undefined,
  })

  const {
    transactions,
    loading,
    error,
    pagination,
    deleteTransaction,
    bulkDeleteTransactions
  } = useTransactions(filters)

  const { summary, loading: summaryLoading } = useTransactionSummary(filters)

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleTypeFilter = (value: string) => {
    setFilters(prev => ({
      ...prev,
      type: value === "all" ? undefined : value as "income" | "expense",
      page: 1
    }))
  }

  const handleMethodFilter = (value: string) => {
    setFilters(prev => ({
      ...prev,
      method: value === "all" ? undefined : value as "sales" | "capex" | "opex",
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleDeleteTransaction = async (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id)
      } catch (error) {
        console.error("Failed to delete transaction:", error)
      }
    }
  }

  const getTypeColor = (type: string) => {
    return type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "sales": return "bg-blue-100 text-blue-800"
      case "capex": return "bg-purple-100 text-purple-800"
      case "opex": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi</CardTitle>
          <CardDescription>Memuat transaksi...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi</CardTitle>
          <CardDescription>Gagal memuat transaksi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.total_income)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.total_expense)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Pendapatan Bersih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.net_income)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaksi</CardTitle>
              <CardDescription>
                Kelola transaksi pendapatan dan pengeluaran Anda
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={onAddTransaction} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari transaksi..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.type || "all"} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="income">Pendapatan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.method || "all"} onValueChange={handleMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                <SelectItem value="sales">Penjualan</SelectItem>
                <SelectItem value="capex">Investasi Modal</SelectItem>
                <SelectItem value="opex">Operasional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Proyek</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(transaction.method)}>
                        {transaction.method}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category?.name}</TableCell>
                    <TableCell>{transaction.project?.name || "-"}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTransaction?.(transaction)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
                {pagination.total} hasil
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
