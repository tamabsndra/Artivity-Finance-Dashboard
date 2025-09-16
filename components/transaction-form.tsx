"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Transaction } from "../types"

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transaction: Partial<Transaction>) => void
  transaction?: Transaction
  mode: "create" | "edit"
}

export function TransactionForm({ isOpen, onClose, onSubmit, transaction, mode }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: transaction?.type || "income",
    method: transaction?.method || "sales",
    category_id: transaction?.category_id || 1,
    project_id: transaction?.project_id || undefined,
    tag_id: transaction?.tag_id || undefined,
    amount: transaction?.amount?.toString() || "",
    description: transaction?.description || "",
    date: transaction?.date || new Date().toISOString().split("T")[0],
  })

  const categories = [
    { id: 1, name: "Design Services", type: "income" },
    { id: 2, name: "Printing Services", type: "income" },
    { id: 3, name: "Consultation", type: "income" },
    { id: 4, name: "Materials & Supplies", type: "expense" },
    { id: 5, name: "Equipment", type: "expense" },
    { id: 6, name: "Marketing", type: "expense" },
    { id: 7, name: "Utilities", type: "expense" },
    { id: 8, name: "Software", type: "expense" },
  ]

  const projects = [
    { id: 1, name: "Brand Identity Package" },
    { id: 2, name: "Wedding Campaign" },
    { id: 3, name: "Corporate Brochures" },
    { id: 4, name: "Event Signage" },
  ]

  const tags = [
    { id: 1, name: "Urgent" },
    { id: 2, name: "Recurring" },
    { id: 3, name: "Promotional" },
    { id: 4, name: "Seasonal" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: Number.parseFloat(formData.amount),
      category_id: formData.category_id,
      project_id: formData.project_id || undefined,
      tag_id: formData.tag_id || undefined,
    })
    onClose()
  }

  const filteredCategories = categories.filter((cat) => cat.type === formData.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Transaction" : "Edit Transaction"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new income or expense transaction." : "Update the transaction details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "income" | "expense") =>
                  setFormData({ ...formData, type: value, category_id: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method">Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: "sales" | "capex" | "opex") => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="opex">OPEX</SelectItem>
                  <SelectItem value="capex">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, category_id: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <Select
                value={formData.project_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, project_id: value ? Number.parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tag">Tag (Optional)</Label>
              <Select
                value={formData.tag_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, tag_id: value ? Number.parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No tag</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "create" ? "Add Transaction" : "Update Transaction"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
