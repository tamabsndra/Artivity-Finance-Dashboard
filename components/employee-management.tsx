"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Users, DollarSign, TrendingUp, Sparkles, Award, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees, useEmployeeSummary, useEmployeePositions } from "@/hooks/useEmployees"
import type { Employee, SalaryHistory } from "@/types/financial"

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function EmployeeManagement() {
  // Use hooks for data management
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, updateSalary } = useEmployees({
    page: 1,
    limit: 50
  })

  const { summary, loading: summaryLoading } = useEmployeeSummary()
  const { positions, loading: positionsLoading } = useEmployeePositions()

  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [isSalaryFormOpen, setIsSalaryFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<Employee | null>(null)

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    position: "",
    type: "full-time" as "full-time" | "freelance" | "contract",
  })

  const [salaryForm, setSalaryForm] = useState({
    amount: "",
    start_date: "",
  })

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const employeeData = {
        name: employeeForm.name,
        position: employeeForm.position,
        type: employeeForm.type,
      }

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData)
      } else {
        await createEmployee(employeeData)
      }

      resetEmployeeForm()
    } catch (error) {
      console.error('Failed to save employee:', error)
    }
  }

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployeeForSalary) return

    try {
      await updateSalary(selectedEmployeeForSalary.id, {
        amount: Number.parseFloat(salaryForm.amount),
        start_date: salaryForm.start_date,
      })

      resetSalaryForm()
    } catch (error) {
      console.error('Failed to update salary:', error)
    }
  }

  const resetEmployeeForm = () => {
    setEmployeeForm({ name: "", position: "", type: "full-time" })
    setEditingEmployee(null)
    setIsEmployeeFormOpen(false)
  }

  const resetSalaryForm = () => {
    setSalaryForm({ amount: "", start_date: "" })
    setSelectedEmployeeForSalary(null)
    setIsSalaryFormOpen(false)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setEmployeeForm({
      name: employee.name,
      position: employee.position,
      type: employee.type,
    })
    setIsEmployeeFormOpen(true)
  }

  const handleDeleteEmployee = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      try {
        await deleteEmployee(id)
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
  }

  const handleUpdateSalary = (employee: Employee) => {
    setSelectedEmployeeForSalary(employee)
    setSalaryForm({
      amount: employee.current_salary?.toString() || "",
      start_date: new Date().toISOString().split("T")[0],
    })
    setIsSalaryFormOpen(true)
  }

  // Use summary data from service or calculate from employees
  const totalMonthlyPayroll = summary?.total_monthly_payroll || employees.reduce((sum, emp) => sum + (emp.current_salary || 0), 0)
  const averageSalary = summary?.average_salary || (employees.length > 0 ? totalMonthlyPayroll / employees.length : 0)
  const fullTimeCount = summary?.full_time_count || employees.filter((emp) => emp.type === "full-time").length
  const highestPaidEmployee = employees.reduce((max, emp) =>
    (emp.current_salary || 0) > (max.current_salary || 0) ? emp : max,
    employees[0] || { current_salary: 0, name: '', position: '' }
  )

  // Mock productivity data
  const productivityData = [
    { id: 1, productivity: 96 }, // Budi - Creative Director
    { id: 2, productivity: 94 }, // Sari - Senior Designer
    { id: 3, productivity: 91 }, // Ahmad - Operator Cetak
    { id: 4, productivity: 89 }, // Maya - Marketing
    { id: 5, productivity: 88 }, // Doni - Operator Konveksi
    { id: 6, productivity: 92 }, // Rina - Junior Designer
    { id: 7, productivity: 85 }, // Agus - Driver
  ]

  return (
    <div className="space-y-6">
      {/* Top Performer Highlight */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Karyawan Terbaik Bulan Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {highestPaidEmployee.name}
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-sm text-gray-600">{highestPaidEmployee.position}</p>
              <Badge variant="default" className="mt-1">
                Produktivitas: 96%
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {formatIDR(highestPaidEmployee.current_salary || 0)}
              </div>
              <div className="text-sm text-yellow-600">Gaji bulanan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{fullTimeCount} tetap</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gaji Bulanan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatIDR(totalMonthlyPayroll)}</div>
            <p className="text-xs text-muted-foreground">Total biaya bulanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Gaji</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(averageSalary)}</div>
            <p className="text-xs text-muted-foreground">Per karyawan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biaya Tahunan</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatIDR(totalMonthlyPayroll * 12)}</div>
            <p className="text-xs text-muted-foreground">Proyeksi tahunan</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manajemen Karyawan</CardTitle>
              <CardDescription>Kelola karyawan dan riwayat gaji</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isEmployeeFormOpen} onOpenChange={setIsEmployeeFormOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Karyawan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan Baru"}</DialogTitle>
                    <DialogDescription>
                      {editingEmployee ? "Perbarui informasi karyawan" : "Tambahkan anggota tim baru"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        placeholder="mis: Ahmad Rizki"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="position">Posisi</Label>
                      <Select
                        value={employeeForm.position}
                        onValueChange={(value) => setEmployeeForm({ ...employeeForm, position: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih posisi" />
                        </SelectTrigger>
                        <SelectContent>
                          {positionsLoading ? (
                            <SelectItem value="" disabled>Memuat posisi...</SelectItem>
                          ) : (
                            positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Jenis Karyawan</Label>
                      <Select
                        value={employeeForm.type}
                        onValueChange={(value: "full-time" | "freelance" | "contract") =>
                          setEmployeeForm({ ...employeeForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Tetap</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="contract">Kontrak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={resetEmployeeForm}>
                        Batal
                      </Button>
                      <Button type="submit">{editingEmployee ? "Perbarui Karyawan" : "Tambah Karyawan"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Gagal memuat data karyawan: {error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Gaji Saat Ini</TableHead>
                  <TableHead className="text-center">Produktivitas</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => {
                const productivity = productivityData.find((p) => p.id === employee.id)?.productivity || 85
                const isTopPerformer = productivity >= 95

                return (
                  <TableRow key={employee.id} className={isTopPerformer ? "bg-green-50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {employee.name}
                        {isTopPerformer && <Sparkles className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge variant={employee.type === "full-time" ? "default" : "outline"}>
                        {employee.type === "full-time"
                          ? "Tetap"
                          : employee.type === "contract"
                            ? "Kontrak"
                            : "Freelance"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {employee.current_salary ? formatIDR(employee.current_salary) : "Belum diset"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`font-medium ${productivity >= 95 ? "text-green-600" : productivity >= 90 ? "text-blue-600" : "text-orange-600"}`}
                        >
                          {productivity}%
                        </span>
                        {isTopPerformer && <Award className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateSalary(employee)}>
                          Update Gaji
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Salary Update Dialog */}
      <Dialog open={isSalaryFormOpen} onOpenChange={setIsSalaryFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Gaji</DialogTitle>
            <DialogDescription>Update gaji untuk {selectedEmployeeForSalary?.name}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSalarySubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Gaji Bulanan Baru (Rp)</Label>
              <Input
                id="amount"
                type="number"
                step="100000"
                value={salaryForm.amount}
                onChange={(e) => setSalaryForm({ ...salaryForm, amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="start_date">Tanggal Efektif</Label>
              <Input
                id="start_date"
                type="date"
                value={salaryForm.start_date}
                onChange={(e) => setSalaryForm({ ...salaryForm, start_date: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetSalaryForm}>
                Batal
              </Button>
              <Button type="submit">Update Gaji</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Team Performance Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Insight Performa Tim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-blue-800">📈 Produktivitas Tim</h4>
                <p className="text-sm text-blue-700">
                  Rata-rata produktivitas tim adalah 91.6%, meningkat 3.2% dari bulan lalu. Tim desain menunjukkan
                  performa terbaik.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-green-800">💰 Efisiensi Biaya</h4>
                <p className="text-sm text-green-700">
                  Biaya per jam produktif adalah Rp 48.500, lebih efisien 8% dibanding industri sejenis.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-purple-800">🎯 Rekomendasi</h4>
                <p className="text-sm text-purple-700">
                  Pertimbangkan bonus performa untuk {highestPaidEmployee.name} dan Ahmad Rizki yang konsisten mencapai
                  produktivitas &gt;95%.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-orange-800">📊 Proyeksi</h4>
                <p className="text-sm text-orange-700">
                  Dengan tingkat produktivitas saat ini, tim dapat menangani 15% lebih banyak proyek tanpa penambahan
                  karyawan.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
