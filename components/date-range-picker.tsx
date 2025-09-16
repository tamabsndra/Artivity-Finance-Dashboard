"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  onRangeChange: (range: { start: string; end: string; label: string }) => void
  currentRange: { start: string; end: string; label: string }
}

export function DateRangePicker({ onRangeChange, currentRange }: DateRangePickerProps) {
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const presetRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ]

  const handlePresetChange = (value: string) => {
    const today = new Date()
    let start: Date, end: Date

    switch (value) {
      case "today":
        start = end = today
        break
      case "week":
        start = new Date(today.setDate(today.getDate() - today.getDay()))
        end = new Date(today.setDate(start.getDate() + 6))
        break
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case "quarter":
        const quarter = Math.floor(today.getMonth() / 3)
        start = new Date(today.getFullYear(), quarter * 3, 1)
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0)
        break
      case "year":
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      default:
        return
    }

    onRangeChange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      label: presetRanges.find((r) => r.value === value)?.label || value,
    })
  }

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      onRangeChange({
        start: customStart,
        end: customEnd,
        label: `${customStart} to ${customEnd}`,
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          {currentRange.label}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <Label>Quick Select</Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a preset range" />
              </SelectTrigger>
              <SelectContent>
                {presetRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start-date" className="text-xs">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-xs">
                  End Date
                </Label>
                <Input id="end-date" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleCustomRange} className="w-full" size="sm">
              Apply Custom Range
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
