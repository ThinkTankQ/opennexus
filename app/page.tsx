import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Activity, 
  Shield, 
  Truck, 
  Users, 
  AlertTriangle, 
  LineChart,
  Building2,
  Heart,
  ArrowRight,
  CheckCircle,
  MapPin,
  Package,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg">MedSight</span>
                <span className="text-muted-foreground ml-1">Botswana</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#coverage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Coverage
              </Link>
              <Link href="#partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Partners
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/patient">
                <Button variant="ghost" size="sm">
                  Patient Portal
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">
                  Health Worker Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                Ministry of Health & Central Medical Stores
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
                Medicine Intelligence for{" "}
                <span className="text-primary">Continuity of Care</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl text-pretty">
                Detect shortage risks early for TB medicines, antimalarials, and chronic care. 
                Ensure every patient receives uninterrupted treatment across all facilities in Botswana.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Access Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/medicines">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                    <Package className="h-4 w-4" />
                    Medicine Catalog
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                <div>
                  <p className="text-3xl font-bold text-primary">177</p>
                  <p className="text-sm text-muted-foreground">Health Facilities</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">9</p>
                  <p className="text-sm text-muted-foreground">Districts Covered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">91%</p>
                  <p className="text-sm text-muted-foreground">Continuity Rate</p>
                </div>
              </div>
            </div>

            {/* Hero Visual - Simplified Map Preview */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl transform rotate-3" />
              <Card className="relative bg-card/95 backdrop-blur shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">National Stock Overview</h3>
                      <p className="text-sm text-muted-foreground">Real-time district monitoring</p>
                    </div>
                    <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                  
                  {/* Mini Map Visualization */}
                  <div className="aspect-square bg-muted/30 rounded-xl p-4 mb-4">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <rect x="10" y="10" width="180" height="180" rx="8" className="fill-muted/50" />
                      {/* Simplified district shapes */}
                      <circle cx="100" cy="60" r="25" className="fill-success/60" />
                      <circle cx="60" cy="100" r="20" className="fill-accent/60" />
                      <circle cx="140" cy="100" r="22" className="fill-success/60" />
                      <circle cx="80" cy="150" r="18" className="fill-destructive/60" />
                      <circle cx="130" cy="145" r="20" className="fill-success/60" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "TB Medicines", status: "good", days: 52 },
                      { label: "Antimalarials", status: "good", days: 45 },
                      { label: "Chronic Care", status: "warning", days: 28 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.days} days</span>
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === "good" ? "bg-success" : 
                            item.status === "warning" ? "bg-accent" : "bg-destructive"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive Medicine Intelligence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From national planning to patient care, MedSight provides visibility at every level 
              of the health supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Early Shortage Detection",
                description: "Predictive alerts for TB, antimalarial, and chronic care medicines before stockouts occur.",
              },
              {
                icon: MapPin,
                title: "District Risk Mapping",
                description: "Visual heatmaps showing stock levels and risk across all 9 Botswana districts.",
              },
              {
                icon: Truck,
                title: "Supply Chain Visibility",
                description: "Track shipments in transit, monitor delivery schedules, and optimize distribution routes.",
              },
              {
                icon: Users,
                title: "Patient Continuity Alerts",
                description: "Identify patients at risk of treatment interruption before it impacts their care.",
              },
              {
                icon: LineChart,
                title: "Consumption Analytics",
                description: "Understand dispensing patterns and forecast demand for better procurement planning.",
              },
              {
                icon: Building2,
                title: "Facility Reporting",
                description: "Real-time stock-on-hand data from health facilities across the country.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-card border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Access Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Designed for Every Role
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Purpose-built dashboards for each stakeholder in the medicine supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                role: "CMS Planners",
                description: "National-level oversight with district risk maps, procurement planning, and shipment tracking.",
                features: ["National stock overview", "District comparisons", "Procurement alerts"],
              },
              {
                role: "Facility Managers",
                description: "Manage pharmacy stock, track orders, and ensure patient medication availability.",
                features: ["Stock management", "Order tracking", "Expiry monitoring"],
              },
              {
                role: "Logistics Teams",
                description: "Coordinate distribution, track shipments, and optimize delivery routes.",
                features: ["Shipment tracking", "Route planning", "Warehouse visibility"],
              },
              {
                role: "Clinicians",
                description: "Check stock before prescribing and monitor patient treatment continuity.",
                features: ["Stock availability", "Patient adherence", "Referral management"],
              },
              {
                role: "Surveillance Teams",
                description: "Monitor disease trends and correlate with medicine availability.",
                features: ["Incidence tracking", "Outcome analysis", "Early warnings"],
              },
              {
                role: "Patients",
                description: "Simple mobile portal to track medications and pickup schedules.",
                features: ["My medications", "Pickup reminders", "Facility finder"],
              },
            ].map((role) => (
              <Card key={role.role} className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{role.role}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <ul className="space-y-2">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                National Coverage
              </h2>
              <p className="text-muted-foreground mb-8">
                MedSight connects health facilities across all districts of Botswana, 
                ensuring medicine availability data flows from the last mile to central planning.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { district: "Central", facilities: 45 },
                  { district: "North-West", facilities: 22 },
                  { district: "South-East", facilities: 8 },
                  { district: "Southern", facilities: 25 },
                  { district: "Kweneng", facilities: 32 },
                  { district: "Kgalagadi", facilities: 8 },
                  { district: "Ghanzi", facilities: 10 },
                  { district: "North-East", facilities: 15 },
                  { district: "Kgatleng", facilities: 12 },
                ].map((district) => (
                  <div key={district.district} className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <span className="font-medium">{district.district}</span>
                    <span className="text-sm text-muted-foreground">{district.facilities} facilities</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Medicine Categories Tracked</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { category: "TB Medicines", items: "Rifampicin, Isoniazid, Pyrazinamide, Ethambutol" },
                  { category: "Antimalarials", items: "Artemether-Lumefantrine, Quinine, Artesunate" },
                  { category: "Chronic Care", items: "Metformin, Amlodipine, Enalapril, Hydrochlorothiazide" },
                ].map((cat) => (
                  <div key={cat.category} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-1">{cat.category}</h4>
                    <p className="text-sm text-muted-foreground">{cat.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            In Partnership With
          </h2>
          <p className="text-muted-foreground mb-12">
            A collaboration between the Ministry of Health and Wellness and Central Medical Stores
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <p className="font-semibold">Ministry of Health</p>
              <p className="text-sm text-muted-foreground">Republic of Botswana</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-10 w-10 text-secondary" />
              </div>
              <p className="font-semibold">Central Medical Stores</p>
              <p className="text-sm text-muted-foreground">Botswana</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ensuring Continuity of Care for Every Patient
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join health workers across Botswana using MedSight to prevent medicine shortages 
            and protect patient treatment outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                Health Worker Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/patient">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">MedSight Botswana</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A public health initiative by the Ministry of Health and Wellness
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link href="/patient" className="hover:text-foreground transition-colors">Patients</Link>
              <span>Support: 0800-MED-SIGHT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
