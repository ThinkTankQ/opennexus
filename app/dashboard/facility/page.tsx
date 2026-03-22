"use client"

import { useState } from "react"
import { DashboardLayout, DashboardSection, DashboardGrid } from "@/components/dashboard/layout"
import { StatsCard, StatsGrid } from "@/components/dashboard/stats-card"
import { RiskBadge, StockGauge, ContinuityRing } from "@/components/dashboard/risk-badge"
import { AlertList } from "@/components/dashboard/alert-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  MEDICINE_STOCK_DATA,
  PATIENT_DATA,
  CONTINUITY_ALERTS,
  BOTSWANA_DISTRICTS,
  FACILITY_DATA,
  DISPENSING_RECORDS,
  FACILITY_INVENTORY,
  MEDICINE_EXPIRY_ALERTS,
} from "@/lib/data"
import { ExpiryAlerts } from "@/components/dashboard/expiry-alerts"
import { 
  Package, 
  Users, 
  AlertTriangle,
  Truck,
  Search,
  Plus,
  Clock,
  CalendarDays,
  ChevronRight,
} from "lucide-react"

// Simulated facility-level stock (subset of national)
const FACILITY_STOCK = MEDICINE_STOCK_DATA.slice(0, 6).map((med) => ({
  ...med,
  stockOnHand: Math.floor(med.stockOnHand * 0.05), // 5% of national at facility level
  monthlyConsumption: Math.floor(med.monthlyConsumption * 0.05),
  reorderPoint: Math.floor(med.monthlyConsumption * 0.05 * 0.5),
  expiryDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

// Pending orders
const PENDING_ORDERS = [
  { id: "ORD-001", items: 3, status: "pending", submittedDate: "2024-01-12", expectedDelivery: "2024-01-20" },
  { id: "ORD-002", items: 5, status: "approved", submittedDate: "2024-01-10", expectedDelivery: "2024-01-18" },
  { id: "ORD-003", items: 2, status: "shipped", submittedDate: "2024-01-08", expectedDelivery: "2024-01-16" },
]

export default function FacilityDashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("South-East")
  const [searchQuery, setSearchQuery] = useState("")

  const facilityAlerts = CONTINUITY_ALERTS.filter(
    (a) => a.facility || a.type === "stock-risk"
  ).slice(0, 4)

  const facilityPatients = PATIENT_DATA.filter(
    (p) => p.district === selectedDistrict || selectedDistrict === "all"
  )

  const lowStockItems = FACILITY_STOCK.filter((m) => m.riskLevel !== "good").length
  const expiringItems = FACILITY_STOCK.filter((m) => {
    const expiry = new Date(m.expiryDate)
    const now = new Date()
    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry < 60
  }).length

  return (
    <DashboardLayout
      role="facility"
      title="Facility Stock Management"
      subtitle="Princess Marina Hospital - South-East District"
      alertCount={lowStockItems}
    >
      <div className="space-y-6">
        {/* Facility Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  District
                </label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOTSWANA_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Facility
                </label>
                <Select defaultValue="princess-marina">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="princess-marina">Princess Marina Hospital</SelectItem>
                    <SelectItem value="bontleng">Bontleng Clinic</SelectItem>
                    <SelectItem value="phase-2">Phase 2 Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm">
                  Change Facility
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <StatsGrid>
          <StatsCard
            title="Stock Items"
            value={FACILITY_STOCK.length}
            subtitle={`${lowStockItems} need attention`}
            icon={<Package className="h-5 w-5" />}
            status={lowStockItems > 2 ? "warning" : "good"}
          />
          <StatsCard
            title="Pending Orders"
            value={PENDING_ORDERS.length}
            subtitle="1 arriving this week"
            icon={<Truck className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Patients Served"
            value="2,450"
            subtitle="This month"
            trend="up"
            trendValue="+12% vs last month"
            icon={<Users className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringItems}
            subtitle="Within 60 days"
            icon={<CalendarDays className="h-5 w-5" />}
            status={expiringItems > 0 ? "warning" : "good"}
          />
        </StatsGrid>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stock Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock on Hand</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Current inventory levels
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead className="text-right">On Hand</TableHead>
                    <TableHead className="text-right">Reorder Point</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FACILITY_STOCK.filter((m) =>
                    m.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((medicine) => {
                    const expiry = new Date(medicine.expiryDate)
                    const now = new Date()
                    const daysUntilExpiry = Math.floor(
                      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    )
                    const isExpiringSoon = daysUntilExpiry < 60

                    return (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell className="text-right">
                          {medicine.stockOnHand.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {medicine.reorderPoint.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <StockGauge daysOfStock={medicine.daysOfStock} showLabel={false} />
                        </TableCell>
                        <TableCell>
                          <span className={isExpiringSoon ? "text-destructive font-medium" : ""}>
                            {medicine.expiryDate}
                          </span>
                          {isExpiringSoon && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              {daysUntilExpiry}d
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <RiskBadge level={medicine.riskLevel} size="sm" showIcon={false} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PENDING_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{order.id}</span>
                        <Badge
                          variant={
                            order.status === "shipped"
                              ? "default"
                              : order.status === "approved"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.items} items | ETA: {order.expectedDelivery}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertList alerts={facilityAlerts} maxItems={3} compact />
              </CardContent>
            </Card>

            {/* Expiring Medicines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpiryAlerts maxItems={3} compact showHeader={false} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Dispensing Records */}
        <DashboardSection
          title="Recent Dispensing Records"
          description="Medicines issued to patients - automatically updates stock levels"
        >
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Dispensing Staff</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Patient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DISPENSING_RECORDS.slice(0, 6).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-medium">{record.medicineName}</TableCell>
                      <TableCell className="text-right">{record.quantity}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{record.programme}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.dispensingStaffName}</TableCell>
                      <TableCell className="text-sm">
                        {record.prescriptionId || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.patientId ? (
                          <span className="text-primary">{record.patientId}</span>
                        ) : (
                          <span className="text-muted-foreground">Walk-in</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </DashboardSection>

        {/* Patient Continuity Section */}
        <DashboardSection
          title="Patient Continuity of Care"
          description="Patients requiring attention for medication pickup or adherence"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilityPatients.map((patient) => (
              <Card key={patient.id} className={
                patient.riskStatus === "critical" 
                  ? "border-destructive/50 bg-destructive/5"
                  : patient.riskStatus === "warning"
                  ? "border-accent/50 bg-accent/5"
                  : ""
              }>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    </div>
                    <ContinuityRing percentage={patient.adherenceRate} size="sm" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next Pickup</span>
                      <span className={
                        new Date(patient.nextPickupDate) < new Date() 
                          ? "text-destructive font-medium" 
                          : ""
                      }>
                        {patient.nextPickupDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Days Supply</span>
                      <span>{patient.medications[0]?.daysSupply || 0} days</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <RiskBadge level={patient.riskStatus} size="sm" />
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DashboardSection>
      </div>
    </DashboardLayout>
  )
}
