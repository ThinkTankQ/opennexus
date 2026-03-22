"use client"

import { useState } from "react"
import { DashboardLayout, DashboardSection, DashboardGrid } from "@/components/dashboard/layout"
import { StatsCard, StatsGrid } from "@/components/dashboard/stats-card"
import { RiskBadge } from "@/components/dashboard/risk-badge"
import { BotswanaMap } from "@/components/maps/botswana-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DISEASE_INCIDENCE_DATA,
  STOCK_TREND_DATA,
  BOTSWANA_DISTRICTS,
  DISTRICT_RISK_DATA,
  REGIONAL_DISPENSING_TRENDS,
  OUTBREAK_ALERTS,
  DISTRICT_HEATMAP_DATA,
  type District,
} from "@/lib/data"
import { 
  Activity, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileBarChart,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Treatment outcomes data
const TREATMENT_OUTCOMES = [
  { name: "Cured", value: 72, color: "hsl(var(--chart-4))" },
  { name: "Completed", value: 15, color: "hsl(var(--chart-1))" },
  { name: "Failed", value: 5, color: "hsl(var(--chart-5))" },
  { name: "Lost to Follow-up", value: 8, color: "hsl(var(--chart-3))" },
]

// Early warning indicators (now using data from lib/data.ts)
const EARLY_WARNINGS = REGIONAL_DISPENSING_TRENDS.filter(t => t.isSpike || t.isTrending).map((trend, i) => ({
  id: i + 1,
  indicator: `${trend.condition} ${trend.isSpike ? 'spike' : 'trend'} detected`,
  district: trend.district,
  change: trend.changePercent,
  severity: trend.changePercent > 50 ? "critical" as const : "warning" as const,
}))

// District-level disease data
const DISTRICT_DISEASE_DATA = BOTSWANA_DISTRICTS.map((district) => ({
  district,
  tbCases: Math.floor(Math.random() * 100) + 20,
  malariaCases: Math.floor(Math.random() * 80) + 10,
  chronicPatients: Math.floor(Math.random() * 500) + 100,
  treatmentSuccess: Math.floor(Math.random() * 20) + 75,
}))

export default function SurveillanceDashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <DashboardLayout
      role="surveillance"
      title="Epidemiological Surveillance"
      subtitle="Disease trends and medicine correlation analysis"
      alertCount={EARLY_WARNINGS.filter((w) => w.severity === "critical").length}
    >
      <div className="space-y-6">
        {/* KPIs */}
        <StatsGrid>
          <StatsCard
            title="Active TB Cases"
            value="1,245"
            subtitle="Across all districts"
            trend="down"
            trendValue="-3% vs last quarter"
            icon={<Activity className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Malaria Incidence"
            value="892"
            subtitle="This month"
            trend="up"
            trendValue="+15% (seasonal)"
            icon={<TrendingUp className="h-5 w-5" />}
            status="warning"
          />
          <StatsCard
            title="Treatment Success"
            value="87%"
            subtitle="TB cure + completion rate"
            trend="up"
            trendValue="+2% improvement"
            icon={<FileBarChart className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Early Warnings"
            value={EARLY_WARNINGS.length}
            subtitle={`${EARLY_WARNINGS.filter((w) => w.severity === "critical").length} critical indicators`}
            icon={<AlertTriangle className="h-5 w-5" />}
            status={EARLY_WARNINGS.some((w) => w.severity === "critical") ? "warning" : "good"}
          />
        </StatsGrid>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Disease Trends Analysis</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Disease Incidence Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Disease Incidence Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly case counts by disease category
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DISEASE_INCIDENCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tb"
                      name="TB Cases"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="malaria"
                      name="Malaria"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-3))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hypertension"
                      name="Hypertension"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="diabetes"
                      name="Diabetes"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-5))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>TB Treatment Outcomes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Current cohort results
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TREATMENT_OUTCOMES}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {TREATMENT_OUTCOMES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {TREATMENT_OUTCOMES.map((outcome) => (
                  <div key={outcome.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: outcome.color }}
                    />
                    <span className="text-sm">
                      {outcome.name}: {outcome.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Early Warnings */}
        <DashboardGrid columns={2}>
          {/* District Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Disease Incidence by District
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BotswanaMap
                selectedDistrict={selectedDistrict}
                onDistrictClick={setSelectedDistrict}
                className="h-[300px]"
              />
              {selectedDistrict && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedDistrict} District</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {(() => {
                      const data = DISTRICT_DISEASE_DATA.find((d) => d.district === selectedDistrict)
                      if (!data) return null
                      return (
                        <>
                          <div>
                            <p className="text-muted-foreground">TB Cases</p>
                            <p className="font-medium">{data.tbCases}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Malaria Cases</p>
                            <p className="font-medium">{data.malariaCases}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Chronic Patients</p>
                            <p className="font-medium">{data.chronicPatients}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Treatment Success</p>
                            <p className="font-medium">{data.treatmentSuccess}%</p>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Early Warning Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Early Warning Indicators
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Unusual patterns detected
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {EARLY_WARNINGS.map((warning) => (
                <div
                  key={warning.id}
                  className={`p-3 rounded-lg border ${
                    warning.severity === "critical"
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-accent/50 bg-accent/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{warning.indicator}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {warning.district} District
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      warning.change > 0 ? "text-destructive" : "text-success"
                    }`}>
                      {warning.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(warning.change)}%
                    </div>
                  </div>
                  <div className="mt-2">
                    <RiskBadge level={warning.severity} size="sm" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </DashboardGrid>

        {/* Medicine-Disease Correlation */}
        <DashboardSection
          title="Medicine Stock vs Disease Outcomes"
          description="Correlation between stock levels and treatment success rates"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STOCK_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="tb"
                      name="TB Stock Days"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="antimalarial"
                      name="Antimalarial Stock Days"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="chronic"
                      name="Chronic Care Stock Days"
                      fill="hsl(var(--chart-3))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Insight cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">TB Correlation</h4>
                  <p className="text-xs text-muted-foreground">
                    Stock decline correlates with 8% drop in treatment completion in affected districts.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Malaria Season</h4>
                  <p className="text-xs text-muted-foreground">
                    Antimalarial consumption up 28% - aligned with seasonal incidence increase.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Chronic Care Alert</h4>
                  <p className="text-xs text-muted-foreground">
                    Metformin stockouts in 3 districts may impact 450 diabetic patients.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>

        {/* Outbreak Detection System */}
        <DashboardSection
          title="Outbreak Detection System"
          description="Disease spread indicators detected from medicine dispensing patterns"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OUTBREAK_ALERTS.map((alert) => (
              <Card 
                key={alert.id}
                className={`${
                  alert.severity === "critical" 
                    ? "border-destructive/50 bg-destructive/5" 
                    : "border-accent/50 bg-accent/5"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === "critical" ? "text-destructive" : "text-accent-foreground"
                      }`} />
                      <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.detectedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold mb-1">{alert.condition}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{alert.district} District</p>
                  
                  <p className="text-sm mb-3">{alert.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Affected Facilities</span>
                    <span className="font-medium">{alert.affectedFacilities}</span>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Action</p>
                    <p className="text-sm">{alert.recommendedAction}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DashboardSection>

        {/* Regional Dispensing Trends Table */}
        <DashboardSection
          title="Regional Dispensing Trends"
          description="Week-over-week medicine dispensing changes by district and condition"
        >
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">District</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Condition</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Programme</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Current Week</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Previous Week</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Change</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {REGIONAL_DISPENSING_TRENDS.map((trend, i) => (
                      <tr key={i} className={trend.isSpike ? "bg-destructive/5" : ""}>
                        <td className="px-4 py-3 text-sm font-medium">{trend.district}</td>
                        <td className="px-4 py-3 text-sm">{trend.condition}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline">{trend.programme}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{trend.dispensingCount}</td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">{trend.previousPeriodCount}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={`flex items-center justify-end gap-1 ${
                            trend.changePercent > 0 ? "text-destructive" : "text-success"
                          }`}>
                            {trend.changePercent > 0 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(trend.changePercent).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {trend.isSpike && (
                            <Badge variant="destructive" className="text-xs">SPIKE</Badge>
                          )}
                          {!trend.isSpike && trend.isTrending && (
                            <Badge variant="secondary" className="text-xs">TRENDING</Badge>
                          )}
                          {!trend.isSpike && !trend.isTrending && (
                            <span className="text-muted-foreground text-xs">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>
    </DashboardLayout>
  )
}
