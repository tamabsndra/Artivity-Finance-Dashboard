"use client"

import type React from "react"

import { useState } from "react"
import {
  FileText,
  Download,
  Settings,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Mail,
  Share2,
  Printer,
  FileBarChart2,
  FileSpreadsheet,
  FilePieChart,
  FileLineChart,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useFinancialData } from "@/hooks/useFinancialData"
import { useTransactions } from "@/hooks/useTransactions"
import { useAssets } from "@/hooks/useAssets"
import { useEmployees } from "@/hooks/useEmployees"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: "financial" | "operational" | "executive" | "investor"
  icon: React.ReactNode
  sections: string[]
  lastGenerated?: string
}

interface ReportSection {
  id: string
  name: string
  description: string
  type: "chart" | "table" | "text" | "kpi"
  required: boolean
  selected: boolean
}

export function ReportGenerator() {
  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: "financial-summary",
      name: "Financial Summary",
      description: "Complete financial performance overview with key metrics and trends",
      type: "financial",
      icon: <FileBarChart2 className="h-8 w-8 text-blue-500" />,
      sections: ["income-statement", "balance-sheet", "cash-flow", "financial-ratios", "executive-summary"],
      lastGenerated: "2024-05-15",
    },
    {
      id: "investor-deck",
      name: "Investor Presentation",
      description: "Comprehensive report for investors and stakeholders",
      type: "investor",
      icon: <FilePieChart className="h-8 w-8 text-purple-500" />,
      sections: ["executive-summary", "market-analysis", "financial-highlights", "projections", "valuation"],
      lastGenerated: "2024-05-01",
    },
    {
      id: "monthly-performance",
      name: "Monthly Performance",
      description: "Monthly business performance with KPIs and targets",
      type: "operational",
      icon: <FileSpreadsheet className="h-8 w-8 text-green-500" />,
      sections: ["monthly-kpis", "revenue-breakdown", "expense-analysis", "project-status"],
      lastGenerated: "2024-06-01",
    },
    {
      id: "executive-dashboard",
      name: "Executive Dashboard",
      description: "High-level overview for executive decision making",
      type: "executive",
      icon: <FileLineChart className="h-8 w-8 text-orange-500" />,
      sections: ["executive-summary", "strategic-kpis", "risk-assessment", "opportunities"],
    },
  ]

  // Available report sections
  const availableSections: ReportSection[] = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description: "High-level business overview",
      type: "text",
      required: true,
      selected: true,
    },
    {
      id: "income-statement",
      name: "Income Statement",
      description: "Revenue, expenses, and profit",
      type: "table",
      required: true,
      selected: true,
    },
    {
      id: "balance-sheet",
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity",
      type: "table",
      required: true,
      selected: true,
    },
    {
      id: "cash-flow",
      name: "Cash Flow Statement",
      description: "Cash inflows and outflows",
      type: "table",
      required: false,
      selected: true,
    },
    {
      id: "financial-ratios",
      name: "Financial Ratios",
      description: "Key financial health indicators",
      type: "table",
      required: false,
      selected: true,
    },
    {
      id: "revenue-breakdown",
      name: "Revenue Breakdown",
      description: "Revenue by category and source",
      type: "chart",
      required: false,
      selected: true,
    },
    {
      id: "expense-analysis",
      name: "Expense Analysis",
      description: "Expense categories and trends",
      type: "chart",
      required: false,
      selected: true,
    },
    {
      id: "monthly-kpis",
      name: "Monthly KPIs",
      description: "Key performance indicators",
      type: "kpi",
      required: false,
      selected: true,
    },
    {
      id: "project-status",
      name: "Project Status",
      description: "Status of active projects",
      type: "table",
      required: false,
      selected: false,
    },
    {
      id: "market-analysis",
      name: "Market Analysis",
      description: "Industry trends and market position",
      type: "text",
      required: false,
      selected: false,
    },
    {
      id: "financial-highlights",
      name: "Financial Highlights",
      description: "Key financial achievements",
      type: "kpi",
      required: false,
      selected: true,
    },
    {
      id: "projections",
      name: "Financial Projections",
      description: "Future financial forecasts",
      type: "chart",
      required: false,
      selected: true,
    },
    {
      id: "valuation",
      name: "Business Valuation",
      description: "Company valuation metrics",
      type: "table",
      required: false,
      selected: true,
    },
    {
      id: "strategic-kpis",
      name: "Strategic KPIs",
      description: "Strategic performance indicators",
      type: "kpi",
      required: false,
      selected: true,
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment",
      description: "Business risks and mitigation",
      type: "text",
      required: false,
      selected: false,
    },
    {
      id: "opportunities",
      name: "Growth Opportunities",
      description: "Future growth opportunities",
      type: "text",
      required: false,
      selected: false,
    },
  ]

  // Use data hooks for report generation
  const { data: financialData, loading: financialLoading } = useFinancialData()
  const { transactions, loading: transactionsLoading } = useTransactions({ page: 1, limit: 100 })
  const { assets, loading: assetsLoading } = useAssets({ page: 1, limit: 100 })
  const { employees, loading: employeesLoading } = useEmployees({ page: 1, limit: 100 })

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(reportTemplates[0])
  const [selectedSections, setSelectedSections] = useState<ReportSection[]>(
    availableSections.filter((section) => selectedTemplate.sections.includes(section.id)),
  )
  const [reportTitle, setReportTitle] = useState(`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`)
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [dateRange, setDateRange] = useState({
    start: "2024-05-01",
    end: "2024-05-31",
  })
  const [includeComparisons, setIncludeComparisons] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(true)
  const [executiveSummary, setExecutiveSummary] = useState(
    "This report provides a comprehensive overview of Artivity's financial performance for the period. " +
      "Key highlights include revenue growth of 8.5% compared to the previous period, with a strong profit margin of 29.8%. " +
      "The cash position remains healthy with working capital improvements and strategic investments in new equipment.",
  )

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<string | null>(null)

  const handleTemplateChange = (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId)!
    setSelectedTemplate(template)
    setSelectedSections(availableSections.filter((section) => template.sections.includes(section.id)))
    setReportTitle(`${template.name} - ${new Date().toLocaleDateString()}`)
  }

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, selected: !section.selected } : section)),
    )
  }

  const generateReport = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReport(`${reportTitle}.pdf`)
      setIsGenerating(false)
    }, 2000)
  }

  const downloadReport = () => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading report: ${generatedReport}`)
  }

  const shareReport = () => {
    // In a real app, this would open a sharing dialog
    console.log(`Sharing report: ${generatedReport}`)
  }

  const printReport = () => {
    // In a real app, this would open the print dialog
    console.log(`Printing report: ${generatedReport}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Report Generator</h2>
          <p className="text-muted-foreground">Create customized reports for different stakeholders and purposes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last Generated: {selectedTemplate.lastGenerated || "Never"}
          </Button>
          <Button className="gap-2" onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="customize">Customize Report</TabsTrigger>
          <TabsTrigger value="preview">Preview & Generate</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedTemplate.id === template.id ? "border-2 border-primary" : ""
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    {template.icon}
                    {selectedTemplate.id === template.id && <Badge variant="default">Selected</Badge>}
                  </div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{template.type}</Badge>
                    <Badge variant="outline">{template.sections.length} sections</Badge>
                    {template.lastGenerated && <Badge variant="secondary">Last: {template.lastGenerated}</Badge>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedTemplate.id === template.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    {selectedTemplate.id === template.id ? "Selected" : "Select Template"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details: {selectedTemplate.name}</CardTitle>
              <CardDescription>Included sections and report structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Included Sections</h4>
                  <div className="space-y-2">
                    {selectedSections.map((section) => (
                      <div key={section.id} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{section.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {section.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Report Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{selectedTemplate.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sections:</span>
                      <span className="font-medium">{selectedTemplate.sections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">PDF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Generated:</span>
                      <span className="font-medium">{selectedTemplate.lastGenerated || "Never"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => document.querySelector('[data-value="customize"]')?.click()}
              >
                <Settings className="h-4 w-4" />
                Customize Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Report Content</CardTitle>
                <CardDescription>Select sections to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSections.map((section) => {
                      const isIncluded = selectedSections.some((s) => s.id === section.id && s.selected)
                      const isAvailable = selectedTemplate.sections.includes(section.id)

                      return (
                        <div
                          key={section.id}
                          className={`p-3 border rounded-lg flex items-start gap-3 ${!isAvailable ? "opacity-50" : ""}`}
                        >
                          <Checkbox
                            id={`section-${section.id}`}
                            checked={isIncluded}
                            onCheckedChange={() => isAvailable && toggleSection(section.id)}
                            disabled={!isAvailable || section.required}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`section-${section.id}`} className="font-medium cursor-pointer">
                              {section.name}
                              {section.required && (
                                <Badge variant="secondary" className="ml-2">
                                  Required
                                </Badge>
                              )}
                            </Label>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          </div>
                          <Badge variant="outline">{section.type}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Settings</CardTitle>
                  <CardDescription>Configure report parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input id="report-title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-period">Report Period</Label>
                      <Select value={reportPeriod} onValueChange={setReportPeriod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-start">Start Date</Label>
                        <Input
                          id="date-start"
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-end">End Date</Label>
                        <Input
                          id="date-end"
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-comparisons">Include Period Comparisons</Label>
                        <Switch
                          id="include-comparisons"
                          checked={includeComparisons}
                          onCheckedChange={setIncludeComparisons}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-charts">Include Charts & Visualizations</Label>
                        <Switch id="include-charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-executive-summary">Include Executive Summary</Label>
                        <Switch
                          id="include-executive-summary"
                          checked={includeExecutiveSummary}
                          onCheckedChange={setIncludeExecutiveSummary}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {includeExecutiveSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                    <CardDescription>Provide a high-level overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={executiveSummary}
                      onChange={(e) => setExecutiveSummary(e.target.value)}
                      className="min-h-[150px]"
                      placeholder="Enter an executive summary for the report..."
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => document.querySelector('[data-value="templates"]')?.click()}>
              Back to Templates
            </Button>
            <Button onClick={() => document.querySelector('[data-value="preview"]')?.click()}>
              Continue to Preview
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Preview your report before generating</CardDescription>
                </div>
                <Button className="gap-2" onClick={generateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">{reportTitle}</h3>
                    <p className="text-muted-foreground">
                      {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                    </p>
                  </div>

                  {includeExecutiveSummary && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Executive Summary</h4>
                      <div className="p-4 bg-white rounded border">
                        <p>{executiveSummary}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Report Contents</h4>
                    <div className="space-y-2">
                      {selectedSections
                        .filter((section) => section.selected)
                        .map((section, index) => (
                          <div key={section.id} className="flex items-center gap-2">
                            <Badge>{index + 1}</Badge>
                            <span className="font-medium">{section.name}</span>
                            <Badge variant="outline" className="ml-auto">
                              {section.type}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded border">
                      <h5 className="font-medium mb-2">Financial Highlights</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Revenue:</span>
                          <span className="font-medium">$45,750</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Expenses:</span>
                          <span className="font-medium">$32,100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Net Profit:</span>
                          <span className="font-medium">$13,650</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profit Margin:</span>
                          <span className="font-medium">29.8%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded border">
                      <h5 className="font-medium mb-2">Key Performance Indicators</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">EBITDA:</span>
                          <span className="font-medium">$22,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ROE:</span>
                          <span className="font-medium">16.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Ratio:</span>
                          <span className="font-medium">2.5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cash Conversion Cycle:</span>
                          <span className="font-medium">45 days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground">
                    <p>Preview shows sample data. Generated report will include actual financial data.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => document.querySelector('[data-value="customize"]')?.click()}>
                Back to Customize
              </Button>
              <Button className="gap-2" onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {generatedReport && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-green-800">Report Generated Successfully</CardTitle>
                    <CardDescription className="text-green-700">
                      Your report is ready to download or share
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Success
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <FileText className="h-12 w-12 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{generatedReport}</h4>
                    <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => shareReport()}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => printReport()}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Print Report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button className="gap-2" onClick={() => downloadReport()}>
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="h-10 px-4 text-left font-medium">Report Name</th>
                          <th className="h-10 px-4 text-left font-medium">Type</th>
                          <th className="h-10 px-4 text-left font-medium">Generated On</th>
                          <th className="h-10 px-4 text-left font-medium">Period</th>
                          <th className="h-10 px-4 text-left font-medium">Format</th>
                          <th className="h-10 px-4 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 px-4 font-medium">Financial Summary - May 2024</td>
                          <td className="p-2 px-4">
                            <Badge variant="outline">Financial</Badge>
                          </td>
                          <td className="p-2 px-4">Jun 1, 2024</td>
                          <td className="p-2 px-4">May 1 - May 31, 2024</td>
                          <td className="p-2 px-4">PDF</td>
                          <td className="p-2 px-4">
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Regenerate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 px-4 font-medium">Investor Presentation - Q1 2024</td>
                          <td className="p-2 px-4">
                            <Badge variant="outline">Investor</Badge>
                          </td>
                          <td className="p-2 px-4">May 1, 2024</td>
                          <td className="p-2 px-4">Jan 1 - Mar 31, 2024</td>
                          <td className="p-2 px-4">PDF</td>
                          <td className="p-2 px-4">
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Regenerate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 px-4 font-medium">Monthly Performance - April 2024</td>
                          <td className="p-2 px-4">
                            <Badge variant="outline">Operational</Badge>
                          </td>
                          <td className="p-2 px-4">May 5, 2024</td>
                          <td className="p-2 px-4">Apr 1 - Apr 30, 2024</td>
                          <td className="p-2 px-4">PDF</td>
                          <td className="p-2 px-4">
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Regenerate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Showing 3 of 3 reports</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="h-10 px-4 text-left font-medium">Report Name</th>
                          <th className="h-10 px-4 text-left font-medium">Frequency</th>
                          <th className="h-10 px-4 text-left font-medium">Next Generation</th>
                          <th className="h-10 px-4 text-left font-medium">Recipients</th>
                          <th className="h-10 px-4 text-center font-medium">Status</th>
                          <th className="h-10 px-4 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 px-4 font-medium">Monthly Financial Summary</td>
                          <td className="p-2 px-4">Monthly (1st)</td>
                          <td className="p-2 px-4">Jul 1, 2024</td>
                          <td className="p-2 px-4">3 recipients</td>
                          <td className="p-2 px-4 text-center">
                            <Badge variant="default">Active</Badge>
                          </td>
                          <td className="p-2 px-4">
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 px-4 font-medium">Quarterly Investor Update</td>
                          <td className="p-2 px-4">Quarterly</td>
                          <td className="p-2 px-4">Jul 5, 2024</td>
                          <td className="p-2 px-4">5 recipients</td>
                          <td className="p-2 px-4 text-center">
                            <Badge variant="default">Active</Badge>
                          </td>
                          <td className="p-2 px-4">
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule New Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
