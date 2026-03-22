"use client"

import { useState } from "react"
import { DashboardLayout, DashboardSection, DashboardGrid } from "@/components/dashboard/layout"
import { StatsCard, StatsGrid } from "@/components/dashboard/stats-card"
import { RiskBadge, StockGauge } from "@/components/dashboard/risk-badge"
import { AlertList } from "@/components/dashboard/alert-card"
import { BotswanaMap } from "@/components/maps/botswana-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  NATIONAL_KPIS, 
  MEDICINE_STOCK_DATA, 
  SHIPMENT_DATA, 
  CONTINUITY_ALERTS,
  STOCK_TREND_DATA,
  MEDICINE_EXPIRY_ALERTS,
  type District,
  type MedicineStock,
} from "@/lib/data"
import { ExpiryAlerts, ExpirySummaryCard } from "@/components/dashboard/expiry-alerts"
import { 
  Package, 
  Building2, 
  Users, 
  AlertTriangle,
  Truck,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function CMSDashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [medicineCategory, setMedicineCategory] = useState<"all" | "tb" | "antimalarial" | "chronic">("all")

  const filteredMedicines = MEDICINE_STOCK_DATA.filter(
    (med) => medicineCategory === "all" || med.category === medicineCategory
  )

  const criticalMedicines = MEDICINE_STOCK_DATA.filter((m) => m.riskLevel === "critical").length
  const warningMedicines = MEDICINE_STOCK_DATA.filter((m) => m.riskLevel === "warning").length

  return (
    <DashboardLayout
      role="cms"
      title="National Overview"
      subtitle="Central Medical Stores Planning Dashboard"
      alertCount={NATIONAL_KPIS.criticalAlerts}
    >
      <div className="space-y-6">
        {/* National KPIs */}
        <StatsGrid>
          <StatsCard
            title="Facilities Reporting"
            value={`${NATIONAL_KPIS.facilitiesReporting}/${NATIONAL_KPIS.totalFacilities}`}
            subtitle={`${NATIONAL_KPIS.reportingRate}% reporting rate`}
            trend="up"
            trendValue="+2% this week"
            icon={<Building2 className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="National Stock Days"
            value={`${NATIONAL_KPIS.nationalStockDays} days`}
            subtitle="Average across all medicines"
            trend="down"
            trendValue="-3 days vs last month"
            icon={<Package className="h-5 w-5" />}
            status={NATIONAL_KPIS.nationalStockDays < 30 ? "warning" : "good"}
          />
          <StatsCard
            title="Patients on Treatment"
            value={NATIONAL_KPIS.patientsOnTreatment.toLocaleString()}
            subtitle={`${NATIONAL_KPIS.continuityRate}% continuity rate`}
            trend="up"
            trendValue="+156 this month"
            icon={<Users className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Critical Alerts"
            value={NATIONAL_KPIS.criticalAlerts}
            subtitle={`${NATIONAL_KPIS.shipmentsInTransit} shipments in transit`}
            icon={<AlertTriangle className="h-5 w-5" />}
            status={NATIONAL_KPIS.criticalAlerts > 5 ? "critical" : "warning"}
          />
        </StatsGrid>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* District Risk Map */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>District Risk Map</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stock risk levels by district
                </p>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <BotswanaMap
                selectedDistrict={selectedDistrict}
                onDistrictClick={setSelectedDistrict}
                className="h-[400px]"
              />
            </CardContent>
          </Card>

          {/* Continuity Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Continuity Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertList
                alerts={CONTINUITY_ALERTS}
                maxItems={4}
                compact
              />
            </CardContent>
          </Card>
        </div>

        {/* Medicine Stock Table */}
        <DashboardSection
          title="Medicine Stock Status"
          description="Current stock levels for priority medicines"
          actions={
            <div className="flex items-center gap-2">
              <Tabs value={medicineCategory} onValueChange={(v) => setMedicineCategory(v as typeof medicineCategory)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tb">TB</TabsTrigger>
                  <TabsTrigger value="antimalarial">Antimalarial</TabsTrigger>
                  <TabsTrigger value="chronic">Chronic</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          }
        >
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock on Hand</TableHead>
                    <TableHead className="text-right">Monthly Consumption</TableHead>
                    <TableHead>Days of Stock</TableHead>
                    <TableHead className="text-right">In Transit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>
                        <span className="capitalize text-muted-foreground">
                          {medicine.category === "tb" ? "TB" : medicine.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {medicine.stockOnHand.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {medicine.monthlyConsumption.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StockGauge daysOfStock={medicine.daysOfStock} />
                      </TableCell>
                      <TableCell className="text-right">
                        {medicine.inTransit > 0 ? (
                          <span className="text-primary font-medium">
                            +{medicine.inTransit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={medicine.riskLevel} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </DashboardSection>

        {/* Stock Trends & Shipments */}
        <DashboardGrid columns={2}>
          {/* Stock Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Trends (6 Months)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Average days of stock by medicine category
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={STOCK_TREND_DATA}>
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
                    <Area
                      type="monotone"
                      dataKey="tb"
                      name="TB Medicines"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="antimalarial"
                      name="Antimalarials"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="chronic"
                      name="Chronic Care"
                      stackId="3"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Shipments in Transit */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shipments in Transit</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {SHIPMENT_DATA.length} active shipments
                </p>
              </div>
              <Truck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {SHIPMENT_DATA.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{shipment.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        shipment.status === "delayed" 
                          ? "bg-destructive/10 text-destructive"
                          : shipment.status === "in-transit"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {shipment.origin} → {shipment.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shipment.medicines.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{shipment.quantity.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      ETA: {new Date(shipment.estimatedArrival).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </DashboardGrid>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{criticalMedicines}</p>
                  <p className="text-sm text-muted-foreground">Critical stock items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{warningMedicines}</p>
                  <p className="text-sm text-muted-foreground">Warning stock items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {MEDICINE_STOCK_DATA.length - criticalMedicines - warningMedicines}
                  </p>
                  <p className="text-sm text-muted-foreground">Healthy stock items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <ExpirySummaryCard />
        </div>

        {/* Expiring Medicines Section */}
        <DashboardSection
          title="Medicines Approaching Expiry"
          description="Items requiring attention to prevent wastage"
        >
          <ExpiryAlerts maxItems={5} showHeader={false} />
        </DashboardSection>
      </div>
    </DashboardLayout>
  )
}
