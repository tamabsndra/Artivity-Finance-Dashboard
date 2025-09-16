"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, TrendingDown, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAssets, useAssetSummary, useAssetCategories } from "@/hooks/useAssets"
import type { Asset } from "@/types/financial"

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AssetManagement() {
  // Use hooks for data management
  const { assets, loading, error, createAsset, updateAsset, deleteAsset } = useAssets({
    page: 1,
    limit: 50
  })

  const { summary, loading: summaryLoading } = useAssetSummary()
  const { categories, loading: categoriesLoading } = useAssetCategories()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    purchase_date: "",
    cost: "",
    depreciation_rate: "",
    lifetime_years: "",
    description: "",
  })

  const calculateCurrentValue = (asset: Asset): number => {
    const purchaseDate = new Date(asset.purchase_date)
    const currentDate = new Date()
    const yearsElapsed = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    const depreciation = asset.cost * (asset.depreciation_rate / 100) * yearsElapsed
    return Math.max(0, asset.cost - depreciation)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const assetData = {
        name: formData.name,
        category: formData.category,
        purchase_date: formData.purchase_date,
        cost: Number.parseFloat(formData.cost),
        depreciation_rate: Number.parseFloat(formData.depreciation_rate),
        lifetime_years: Number.parseInt(formData.lifetime_years),
        description: formData.description,
      }

      if (editingAsset) {
        await updateAsset(editingAsset.id, assetData)
      } else {
        await createAsset(assetData)
      }

      resetForm()
    } catch (error) {
      console.error('Failed to save asset:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      purchase_date: "",
      cost: "",
      depreciation_rate: "",
      lifetime_years: "",
      description: "",
    })
    setEditingAsset(null)
    setIsFormOpen(false)
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchase_date,
      cost: asset.cost.toString(),
      depreciation_rate: asset.depreciation_rate.toString(),
      lifetime_years: asset.lifetime_years.toString(),
      description: asset.description,
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus aset ini?")) {
      try {
        await deleteAsset(id)
      } catch (error) {
        console.error('Failed to delete asset:', error)
      }
    }
  }

  // Use summary data from service or calculate from assets
  const totalAssetValue = summary?.total_value || assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0)
  const totalDepreciation = summary?.total_depreciation || assets.reduce((sum, asset) => sum + (asset.cost - (asset.current_value || 0)), 0)
  const mostValuableAsset = assets.reduce((max, asset) =>
    (asset.current_value || 0) > (max.current_value || 0) ? asset : max,
    assets[0] || { current_value: 0, name: '', category: '' }
  )

  return (
    <div className="space-y-6">
      {/* Most Valuable Asset Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Aset Paling Berharga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{mostValuableAsset.name}</h3>
              <p className="text-sm text-gray-600">{mostValuableAsset.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {formatIDR(mostValuableAsset.current_value || 0)}
              </div>
              <div className="text-sm text-purple-600">Nilai saat ini</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai Aset</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatIDR(totalAssetValue)}</div>
            <p className="text-xs text-muted-foreground">Nilai setelah depresiasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depresiasi</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatIDR(totalDepreciation)}</div>
            <p className="text-xs text-muted-foreground">Akumulasi depresiasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Aset</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Total aset terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manajemen Aset</CardTitle>
              <CardDescription>Kelola dan pantau aset bisnis dengan depresiasi</CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Aset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingAsset ? "Edit Aset" : "Tambah Aset Baru"}</DialogTitle>
                  <DialogDescription>
                    {editingAsset ? "Perbarui informasi aset" : "Tambahkan aset bisnis baru untuk dilacak"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Aset</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="mis: Mesin Printer Digital Epson"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="" disabled>Memuat kategori...</SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">Harga Beli (Rp)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="1000"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="purchase_date">Tanggal Pembelian</Label>
                      <Input
                        id="purchase_date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="depreciation_rate">Tingkat Depresiasi (%/tahun)</Label>
                      <Input
                        id="depreciation_rate"
                        type="number"
                        step="0.1"
                        value={formData.depreciation_rate}
                        onChange={(e) => setFormData({ ...formData, depreciation_rate: e.target.value })}
                        placeholder="20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lifetime_years">Masa Pakai (tahun)</Label>
                      <Input
                        id="lifetime_years"
                        type="number"
                        value={formData.lifetime_years}
                        onChange={(e) => setFormData({ ...formData, lifetime_years: e.target.value })}
                        placeholder="5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi aset"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                    <Button type="submit">{editingAsset ? "Perbarui Aset" : "Tambah Aset"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Gagal memuat data aset: {error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal Beli</TableHead>
                  <TableHead className="text-right">Harga Asli</TableHead>
                  <TableHead className="text-right">Nilai Sekarang</TableHead>
                  <TableHead className="text-right">Depresiasi</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => {
                const currentValue = calculateCurrentValue(asset)
                const depreciation = asset.cost - currentValue
                const depreciationPercent = (depreciation / asset.cost) * 100
                const isHighValue = currentValue > 50000000

                return (
                  <TableRow key={asset.id} className={isHighValue ? "bg-yellow-50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {asset.name}
                        {isHighValue && <Sparkles className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.category}</Badge>
                    </TableCell>
                    <TableCell>{new Date(asset.purchase_date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right font-medium">{formatIDR(asset.cost)}</TableCell>
                    <TableCell className="text-right font-medium text-blue-600">{formatIDR(currentValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="text-red-600 font-medium">{formatIDR(depreciation)}</div>
                      <div className="text-xs text-gray-500">{depreciationPercent.toFixed(1)}%</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(asset)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
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

      {/* Asset Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown Kategori Aset</CardTitle>
          <CardDescription>Distribusi nilai aset berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(summary?.category_breakdown || Array.from(new Set(assets.map((a) => a.category))).map((category) => {
                const categoryAssets = assets.filter((a) => a.category === category)
                const categoryValue = categoryAssets.reduce((sum, a) => sum + (a.current_value || 0), 0)
                const categoryCount = categoryAssets.length
                return { category, count: categoryCount, value: categoryValue }
              })).map((item) => (
                <div key={item.category} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{item.category}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Nilai Total:</span>
                      <span className="font-medium">{formatIDR(item.value)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Jumlah Item:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rata-rata Nilai:</span>
                      <span className="font-medium">{formatIDR(item.value / item.count)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Insight Cerdas Aset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-green-800">💡 Rekomendasi</h4>
                <p className="text-sm text-green-700">
                  Pertimbangkan untuk upgrade {mostValuableAsset.name} dalam 2 tahun ke depan untuk mempertahankan
                  kualitas produksi.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-blue-800">📊 Analisis</h4>
                <p className="text-sm text-blue-700">
                  Tingkat depresiasi rata-rata aset Anda adalah{" "}
                  {(assets.reduce((sum, a) => sum + a.depreciation_rate, 0) / assets.length).toFixed(1)}% per tahun.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-purple-800">🎯 Target</h4>
                <p className="text-sm text-purple-700">
                  Dengan nilai aset saat ini {formatIDR(totalAssetValue)}, Anda bisa mengajukan kredit hingga{" "}
                  {formatIDR(totalAssetValue * 0.7)} (70% dari nilai aset).
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-semibold text-orange-800">⚠️ Perhatian</h4>
                <p className="text-sm text-orange-700">
                  {
                    assets.filter((a) => {
                      const age =
                        (new Date().getTime() - new Date(a.purchase_date).getTime()) / (1000 * 60 * 60 * 24 * 365)
                      return age > a.lifetime_years * 0.8
                    }).length
                  }{" "}
                  aset sudah mendekati akhir masa pakai.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
