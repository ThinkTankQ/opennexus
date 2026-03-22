"use client"

import { use } from "react"
import Link from "next/link"
import { DashboardLayout, DashboardSection } from "@/components/dashboard/layout"
import { RiskBadge, ContinuityRing } from "@/components/dashboard/risk-badge"
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
import { PATIENTS_WITH_HISTORY } from "@/lib/data"
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Pill,
  FileText,
  Clock,
  Building2,
  ArrowLeft,
  Printer,
  Download,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export default function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const patient = PATIENTS_WITH_HISTORY.find((p) => p.id === id)

  if (!patient) {
    return (
      <DashboardLayout role="clinician" title="Patient Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Patient with ID {id} not found.</p>
          <Link href="/dashboard/clinician">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const totalPrescriptions = patient.prescriptionHistory.length
  const activePrescriptions = patient.prescriptionHistory.filter(
    (rx) => rx.status === "active"
  ).length

  return (
    <DashboardLayout
      role="clinician"
      title={patient.name}
      subtitle="Patient Treatment History"
    >
      <div className="space-y-6">
        {/* Patient Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Patient Info */}
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{patient.name}</h2>
                    <RiskBadge level={patient.riskStatus} />
                  </div>
                  <p className="text-muted-foreground">{patient.condition}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      DOB: {patient.dateOfBirth} ({patient.gender})
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      ID: {patient.nationalId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Adherence Ring */}
              <div className="flex items-center gap-6">
                <ContinuityRing
                  percentage={patient.adherenceRate}
                  size="lg"
                  label="Adherence"
                />
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Treatment Phase</p>
                    <p className="font-medium">{patient.treatmentPhase || "Ongoing"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Started</p>
                    <p className="font-medium">{patient.treatmentStartDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Location Info */}
            <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Home Address</p>
                  <p className="font-medium">{patient.homeAddress}</p>
                  <p className="text-sm text-muted-foreground">{patient.homeDistrict} District</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{patient.phoneNumber}</p>
                  <p className="text-sm text-muted-foreground">Emergency: {patient.emergencyContact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Facility</p>
                  <p className="font-medium">{patient.facility}</p>
                  <p className="text-sm text-muted-foreground">{patient.district} District</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
              <Button>
                <Pill className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print History
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Link href="/dashboard/clinician">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Patients
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">
              Prescription History
              <Badge variant="secondary" className="ml-2">{totalPrescriptions}</Badge>
            </TabsTrigger>
            <TabsTrigger value="current">
              Current Medications
              <Badge variant="secondary" className="ml-2">{patient.medications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="timeline">Treatment Timeline</TabsTrigger>
          </TabsList>

          {/* Prescription History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Complete Prescription History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prescription ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Medicines</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.prescriptionHistory.map((rx) => (
                      <TableRow key={rx.id}>
                        <TableCell className="font-mono text-sm">{rx.id}</TableCell>
                        <TableCell>{rx.prescribedDate}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rx.prescriberName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rx.facilityName}</p>
                            <p className="text-xs text-muted-foreground">{rx.facilityDistrict}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rx.medicines.map((med, i) => (
                              <Badge key={i} variant="outline" className="mr-1 text-xs">
                                {med.name} {med.dosage}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={rx.diagnosis}>
                          {rx.diagnosis}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              rx.status === "active"
                                ? "default"
                                : rx.status === "completed"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {rx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Detailed Prescription Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {patient.prescriptionHistory.map((rx) => (
                <Card key={rx.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{rx.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rx.diagnosis}</p>
                      </div>
                      <Badge
                        variant={rx.status === "active" ? "default" : "secondary"}
                      >
                        {rx.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Facility Info */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{rx.facilityName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{rx.facilityAddress}</p>
                      <p className="text-xs text-muted-foreground">{rx.facilityDistrict} District</p>
                    </div>

                    {/* Prescriber & Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Prescribed By</p>
                        <p className="font-medium">{rx.prescriberName}</p>
                        <p className="text-xs text-muted-foreground">{rx.prescribedDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dispensed By</p>
                        <p className="font-medium">{rx.dispensedBy || "-"}</p>
                        <p className="text-xs text-muted-foreground">{rx.dispensedDate || "-"}</p>
                      </div>
                    </div>

                    {/* Medicines */}
                    <div>
                      <p className="text-sm font-medium mb-2">Medicines Prescribed</p>
                      <div className="space-y-2">
                        {rx.medicines.map((med, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-muted/30 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">{med.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {med.dosage} - {med.frequency}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <p>{med.quantity} units</p>
                              <p className="text-xs text-muted-foreground">{med.durationDays} days</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Current Medications Tab */}
          <TabsContent value="current">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.medications.map((med, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Pill className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Frequency</span>
                            <span>{med.frequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Days Supply</span>
                            <span className={med.daysSupply <= 3 ? "text-destructive font-medium" : ""}>
                              {med.daysSupply} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Refills</span>
                            <span>{med.refillsRemaining}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Next Pickup Alert */}
            <Card className="mt-4 border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">Next Medication Pickup</p>
                    <p className="text-lg font-bold text-primary">{patient.nextPickupDate}</p>
                    <p className="text-sm text-muted-foreground">at {patient.facility}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8">
                  {patient.prescriptionHistory
                    .sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime())
                    .map((rx, i) => (
                      <div key={rx.id} className="relative pb-8 last:pb-0">
                        {/* Line */}
                        {i < patient.prescriptionHistory.length - 1 && (
                          <div className="absolute left-[-20px] top-6 h-full w-0.5 bg-border" />
                        )}
                        {/* Dot */}
                        <div
                          className={`absolute left-[-26px] top-1 h-3 w-3 rounded-full border-2 ${
                            rx.status === "active"
                              ? "border-primary bg-primary"
                              : "border-muted-foreground bg-background"
                          }`}
                        />
                        {/* Content */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{rx.prescribedDate}</span>
                            <Badge variant={rx.status === "active" ? "default" : "secondary"}>
                              {rx.status}
                            </Badge>
                          </div>
                          <p className="text-sm">{rx.diagnosis}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {rx.facilityName}, {rx.facilityDistrict}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {rx.prescriberName}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rx.medicines.map((med, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {med.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
