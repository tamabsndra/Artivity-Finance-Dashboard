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
import type { Employee, SalaryHistory } from "../types"

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
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Budi Santoso",
      position: "Creative Director & Owner",
      type: "full-time",
      current_salary: 12000000,
    },
    {
      id: 2,
      name: "Sari Dewi Lestari",
      position: "Senior Graphic Designer",
      type: "full-time",
      current_salary: 7200000,
    },
    {
      id: 3,
      name: "Ahmad Rizki Pratama",
      position: "Operator Mesin Cetak",
      type: "full-time",
      current_salary: 5800000,
    },
    {
      id: 4,
      name: "Maya Putri Salsabila",
      position: "Marketing & Account Manager",
      type: "full-time",
      current_salary: 6500000,
    },
    {
      id: 5,
      name: "Doni Setiawan",
      position: "Operator Konveksi",
      type: "full-time",
      current_salary: 5200000,
    },
    {
      id: 6,
      name: "Rina Handayani",
      position: "Junior Designer",
      type: "freelance",
      current_salary: 4500000,
    },
    {
      id: 7,
      name: "Agus Wijaya",
      position: "Driver & Helper",
      type: "contract",
      current_salary: 3800000,
    },
  ])

  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([
    // Budi Santoso - Creative Director
    { id: 1, employee_id: 1, amount: 10000000, start_date: "2023-01-01", end_date: "2023-12-31" },
    { id: 2, employee_id: 1, amount: 12000000, start_date: "2024-01-01", end_date: undefined },

    // Sari Dewi - Senior Designer
    { id: 3, employee_id: 2, amount: 6500000, start_date: "2023-06-01", end_date: "2024-02-29" },
    { id: 4, employee_id: 2, amount: 7200000, start_date: "2024-03-01", end_date: undefined },

    // Ahmad Rizki - Operator Cetak
    { id: 5, employee_id: 3, amount: 5200000, start_date: "2023-03-01", end_date: "2024-01-31" },
    { id: 6, employee_id: 3, amount: 5800000, start_date: "2024-02-01", end_date: undefined },

    // Maya Putri - Marketing
    { id: 7, employee_id: 4, amount: 6000000, start_date: "2023-08-01", end_date: "2024-02-29" },
    { id: 8, employee_id: 4, amount: 6500000, start_date: "2024-03-01", end_date: undefined },

    // Doni - Operator Konveksi
    { id: 9, employee_id: 5, amount: 4800000, start_date: "2023-05-01", end_date: "2024-01-31" },
    { id: 10, employee_id: 5, amount: 5200000, start_date: "2024-02-01", end_date: undefined },
  ])

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

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEmployee: Employee = {
      id: editingEmployee?.id || Date.now(),
      ...employeeForm,
    }

    if (editingEmployee) {
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? newEmployee : emp)))
    } else {
      setEmployees([...employees, newEmployee])
    }

    resetEmployeeForm()
  }

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployeeForSalary) return

    // End current salary
    const updatedHistory = salaryHistory.map((sh) =>
      sh.employee_id === selectedEmployeeForSalary.id && !sh.end_date ? { ...sh, end_date: salaryForm.start_date } : sh,
    )

    // Add new salary record
    const newSalaryRecord: SalaryHistory = {
      id: Date.now(),
      employee_id: selectedEmployeeForSalary.id,
      amount: Number.parseFloat(salaryForm.amount),
      start_date: salaryForm.start_date,
      end_date: undefined,
    }

    setSalaryHistory([...updatedHistory, newSalaryRecord])

    // Update employee current salary
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployeeForSalary.id
          ? { ...emp, current_salary: Number.parseFloat(salaryForm.amount) }
          : emp,
      ),
    )

    resetSalaryForm()
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

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
    setSalaryHistory(salaryHistory.filter((sh) => sh.employee_id !== id))
  }

  const handleUpdateSalary = (employee: Employee) => {
    setSelectedEmployeeForSalary(employee)
    setSalaryForm({
      amount: employee.current_salary?.toString() || "",
      start_date: new Date().toISOString().split("T")[0],
    })
    setIsSalaryFormOpen(true)
  }

  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.current_salary || 0), 0)
  const averageSalary = totalMonthlyPayroll / employees.length
  const fullTimeCount = employees.filter((emp) => emp.type === "full-time").length
  const highestPaidEmployee = employees.reduce((max, emp) =>
    (emp.current_salary || 0) > (max.current_salary || 0) ? emp : max,
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
                      <Input
                        id="position"
                        value={employeeForm.position}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                        placeholder="mis: Desainer Grafis"
                        required
                      />
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
