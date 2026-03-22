"use client"

import { useState } from "react"
import { DashboardLayout, DashboardSection, DashboardGrid } from "@/components/dashboard/layout"
import { StatsCard, StatsGrid } from "@/components/dashboard/stats-card"
import { RiskBadge, ContinuityRing, StockGauge } from "@/components/dashboard/risk-badge"
import { AlertList } from "@/components/dashboard/alert-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  PATIENT_DATA,
  MEDICINE_STOCK_DATA,
  CONTINUITY_ALERTS,
  PATIENTS_WITH_HISTORY,
} from "@/lib/data"
import Link from "next/link"
import { 
  Users, 
  AlertTriangle,
  Search,
  CheckCircle,
  Clock,
  Calendar,
  Package,
  ArrowRight,
  Activity,
  Pill,
  UserPlus,
  FileText,
} from "lucide-react"

// Use enhanced patient data with history
const CLINICIAN_PATIENTS = PATIENTS_WITH_HISTORY

// Quick stock check for common prescriptions
const QUICK_STOCK = MEDICINE_STOCK_DATA.slice(0, 5).map((med) => ({
  ...med,
  canPrescribe: med.riskLevel !== "critical",
  facilityStock: Math.floor(med.stockOnHand * 0.03),
}))

export default function ClinicianDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-patients")

  const criticalPatients = CLINICIAN_PATIENTS.filter((p) => p.riskStatus === "critical").length
  const warningPatients = CLINICIAN_PATIENTS.filter((p) => p.riskStatus === "warning").length
  const overduePickups = CLINICIAN_PATIENTS.filter(
    (p) => new Date(p.nextPickupDate) < new Date()
  ).length

  const filteredPatients = CLINICIAN_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const clinicianAlerts = CONTINUITY_ALERTS.filter(
    (a) => a.type === "missed-pickup" || a.type === "low-adherence" || a.type === "treatment-gap"
  )

  return (
    <DashboardLayout
      role="clinician"
      title="Clinician Dashboard"
      subtitle="Dr. Mosweu - Princess Marina Hospital"
      alertCount={criticalPatients + overduePickups}
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Patient Records Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Access full prescription history, treatment records, and patient locations
                  </p>
                </div>
              </div>
              <Link href="/patient">
                <Button>
                  Open Patient Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <StatsGrid>
          <StatsCard
            title="My Patients"
            value={CLINICIAN_PATIENTS.length}
            subtitle={`${criticalPatients} need urgent attention`}
            icon={<Users className="h-5 w-5" />}
            status={criticalPatients > 0 ? "critical" : "good"}
          />
          <StatsCard
            title="Overdue Pickups"
            value={overduePickups}
            subtitle="Missed medication collection"
            icon={<Clock className="h-5 w-5" />}
            status={overduePickups > 0 ? "critical" : "good"}
          />
          <StatsCard
            title="Avg Adherence"
            value="87%"
            subtitle="Across active patients"
            icon={<Activity className="h-5 w-5" />}
            status="good"
          />
          <StatsCard
            title="Appointments Today"
            value="8"
            subtitle="3 completed, 5 remaining"
            icon={<Calendar className="h-5 w-5" />}
            status="good"
          />
        </StatsGrid>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
          <Button variant="outline">
            <Pill className="h-4 w-4 mr-2" />
            Prescribe
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Management</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-56"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="my-patients">All Patients</TabsTrigger>
                  <TabsTrigger value="attention">
                    Need Attention
                    {(criticalPatients + warningPatients) > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {criticalPatients + warningPatients}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="tb">TB</TabsTrigger>
                  <TabsTrigger value="chronic">Chronic</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-3">
                    {filteredPatients
                      .filter((p) => {
                        if (activeTab === "attention") return p.riskStatus !== "good"
                        if (activeTab === "tb") return p.condition.includes("TB")
                        if (activeTab === "chronic") return p.condition.includes("Hypertension") || p.condition.includes("Diabetes")
                        return true
                      })
                      .map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                            patient.riskStatus === "critical"
                              ? "border-destructive/50 bg-destructive/5"
                              : patient.riskStatus === "warning"
                              ? "border-accent/50 bg-accent/5"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <ContinuityRing
                                percentage={patient.adherenceRate}
                                size="sm"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{patient.name}</h4>
                                  <RiskBadge level={patient.riskStatus} size="sm" showIcon={false} />
                                </div>
                                <p className="text-sm text-muted-foreground">{patient.condition}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="text-muted-foreground">
                                    ID: {patient.nationalId}
                                  </span>
                                  <span className={
                                    new Date(patient.nextPickupDate) < new Date()
                                      ? "text-destructive font-medium"
                                      : "text-muted-foreground"
                                  }>
                                    Next: {patient.nextPickupDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/dashboard/clinician/patient/${patient.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>

                          {/* Medications */}
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Current Medications
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {patient.medications.map((med, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {med.name} ({med.daysSupply}d supply)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stock Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Availability
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Can I prescribe today?
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {QUICK_STOCK.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{med.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {med.facilityStock.toLocaleString()} in stock
                      </p>
                    </div>
                    {med.canPrescribe ? (
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Full Stock List
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Patient Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertList alerts={clinicianAlerts} maxItems={3} compact />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Treatment Timeline */}
        <DashboardSection
          title="Continuity of Care Timeline"
          description="Treatment progress for patients requiring attention"
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {CLINICIAN_PATIENTS.filter((p) => p.riskStatus !== "good").map((patient) => {
                  const startDate = new Date(patient.treatmentStartDate)
                  const now = new Date()
                  const daysSinceStart = Math.floor(
                    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  const expectedDuration = patient.condition.includes("TB") ? 180 : 365
                  const progress = Math.min((daysSinceStart / expectedDuration) * 100, 100)

                  return (
                    <div key={patient.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.condition}</p>
                          </div>
                          <RiskBadge level={patient.riskStatus} size="sm" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.round(progress)}% complete</p>
                          <p className="text-xs text-muted-foreground">
                            Day {daysSinceStart} of {expectedDuration}
                          </p>
                        </div>
                      </div>
                      
                      {/* Timeline visualization */}
                      <div className="relative">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              patient.riskStatus === "critical"
                                ? "bg-destructive"
                                : patient.riskStatus === "warning"
                                ? "bg-accent"
                                : "bg-success"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {/* Timeline markers */}
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Start: {patient.treatmentStartDate}</span>
                          <span>Adherence: {patient.adherenceRate}%</span>
                          <span>
                            Target: {new Date(startDate.getTime() + expectedDuration * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>
    </DashboardLayout>
  )
}
