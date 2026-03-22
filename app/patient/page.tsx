'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContinuityRing, RiskBadge } from '@/components/dashboard/risk-badge';
import { PATIENTS_WITH_HISTORY, type PatientWithHistory } from '@/lib/data';
import {
  Activity,
  Search,
  User,
  MapPin,
  Phone,
  Calendar,
  Pill,
  FileText,
  ArrowLeft,
  Home,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Stethoscope,
  Building2,
  Clock,
  Shield,
} from 'lucide-react';

// Auth check component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // In a real app, this would check session/token
    // For demo, we check if they came from login flow
    const hasSession = sessionStorage.getItem('medsight_auth');
    if (!hasSession) {
      // For demo purposes, we'll allow access but show login prompt
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground">
                The Patient Records Portal is restricted to authorized healthcare providers only.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Clinician Access Only</p>
                  <p className="text-xs text-muted-foreground">
                    Only registered clinicians can access patient prescription history and treatment records.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full">
                  Sign In as Clinician
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Patient search and list component
function PatientRecordsPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientWithHistory | null>(null);

  const filteredPatients = PATIENTS_WITH_HISTORY.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.nationalId.includes(searchQuery) ||
      patient.id.includes(searchQuery)
  );

  if (selectedPatient) {
    return (
      <PatientDetailView
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Link href="/dashboard/clinician">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">Patient Records Portal</h1>
                <p className="text-xs text-muted-foreground">Clinician Access</p>
              </div>
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or National ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Advanced Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Records ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Adherence</TableHead>
                    <TableHead>Risk Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.gender}, DOB: {patient.dateOfBirth}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{patient.id}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {patient.homeDistrict}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={patient.adherenceRate} className="w-16 h-2" />
                          <span className="text-sm">{patient.adherenceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={patient.riskStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          View Records
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {PATIENTS_WITH_HISTORY.filter((p) => p.riskStatus === 'critical').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Critical patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {PATIENTS_WITH_HISTORY.filter((p) => p.riskStatus === 'warning').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Requiring follow-up</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {PATIENTS_WITH_HISTORY.filter((p) => p.riskStatus === 'good').length}
                  </p>
                  <p className="text-sm text-muted-foreground">On track</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Patient detail view
function PatientDetailView({
  patient,
  onBack,
}: {
  patient: PatientWithHistory;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">{patient.name}</h1>
              <p className="text-xs text-muted-foreground">Patient ID: {patient.id}</p>
            </div>
          </div>
          <RiskBadge level={patient.riskStatus} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Patient Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">National ID</p>
                  <p className="font-medium">{patient.nationalId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{patient.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Contact & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Home Address</p>
                  <p className="font-medium">{patient.homeAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">District</p>
                  <p className="font-medium">{patient.homeDistrict}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Treatment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Treatment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <ContinuityRing percentage={patient.adherenceRate} size="lg" label="Adherence" />
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{patient.condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Treatment Started</p>
                  <p className="font-medium">{patient.treatmentStartDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Primary Facility</p>
                  <p className="font-medium">{patient.facility}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Pickup</p>
                  <p className="font-medium">{patient.nextPickupDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Days Supply</TableHead>
                  <TableHead>Refills</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.medications.map((med, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>
                      <span className={med.daysSupply < 7 ? 'text-destructive font-medium' : ''}>
                        {med.daysSupply} days
                      </span>
                    </TableCell>
                    <TableCell>{med.refillsRemaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Prescription History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prescription History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.prescriptionHistory.map((rx) => (
              <div
                key={rx.id}
                className={`border rounded-lg p-4 ${
                  rx.status === 'active' ? 'border-primary bg-primary/5' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{rx.id}</span>
                      <Badge variant={rx.status === 'active' ? 'default' : 'secondary'}>
                        {rx.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rx.diagnosis}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{rx.prescribedDate}</p>
                    <p className="text-muted-foreground">Prescribed</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Prescriber</p>
                      <p className="font-medium">{rx.prescriberName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Facility</p>
                      <p className="font-medium">{rx.facilityName}</p>
                      <p className="text-xs text-muted-foreground">
                        {rx.facilityAddress}, {rx.facilityDistrict}
                      </p>
                    </div>
                  </div>
                </div>

                {rx.dispensedDate && (
                  <div className="flex items-center gap-2 text-sm mb-3 p-2 bg-success/10 rounded">
                    <Calendar className="h-4 w-4 text-success" />
                    <span>
                      Dispensed on {rx.dispensedDate} by {rx.dispensedBy}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Prescribed Medicines:</p>
                  <div className="flex flex-wrap gap-2">
                    {rx.medicines.map((med, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {med.name} {med.dosage} x{med.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Main export
export default function PatientPortalPage() {
  // Set auth on mount for demo purposes when coming from login
  useEffect(() => {
    // Check if we came from a logged-in state (clinician dashboard link)
    const referrer = document.referrer;
    if (referrer.includes('/dashboard/clinician') || referrer.includes('/login')) {
      sessionStorage.setItem('medsight_auth', 'clinician');
    }
  }, []);

  return (
    <AuthGuard>
      <PatientRecordsPortal />
    </AuthGuard>
  );
}
