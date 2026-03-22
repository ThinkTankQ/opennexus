"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { USER_ROLES, type UserRole } from "@/lib/data"
import { 
  Activity, 
  Building2, 
  Truck, 
  Stethoscope, 
  BarChart3, 
  User,
  ArrowRight,
  ArrowLeft,
  Shield,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const roleIcons: Record<UserRole, React.ReactNode> = {
  cms: <Building2 className="h-6 w-6" />,
  facility: <Building2 className="h-6 w-6" />,
  logistics: <Truck className="h-6 w-6" />,
  clinician: <Stethoscope className="h-6 w-6" />,
  surveillance: <BarChart3 className="h-6 w-6" />,
}

const roleRedirects: Record<UserRole, string> = {
  cms: "/dashboard/cms",
  facility: "/dashboard/facility",
  logistics: "/dashboard/logistics",
  clinician: "/dashboard/clinician",
  surveillance: "/dashboard/surveillance",
}

// Demo credentials for each role
const demoCredentials: Record<UserRole, { username: string; password: string }> = {
  cms: { username: "cms.planner@moh.gov.bw", password: "demo123" },
  facility: { username: "facility.manager@moh.gov.bw", password: "demo123" },
  logistics: { username: "logistics@cms.gov.bw", password: "demo123" },
  clinician: { username: "dr.mosweu@marina.gov.bw", password: "demo123" },
  surveillance: { username: "surveillance@moh.gov.bw", password: "demo123" },
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    // Pre-fill demo credentials
    setUsername(demoCredentials[role].username)
    setPassword(demoCredentials[role].password)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    
    setIsLoading(true)
    // Simulate login and set auth session
    await new Promise((resolve) => setTimeout(resolve, 800))
    sessionStorage.setItem('medsight_auth', selectedRole)
    router.push(roleRedirects[selectedRole])
  }

  const handleBack = () => {
    setSelectedRole(null)
    setUsername("")
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go Back</span>
          </Button>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">MedSight Botswana</h1>
            <p className="text-muted-foreground">Medicine Intelligence Platform</p>
          </div>

          {!selectedRole ? (
            // Role Selection
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Select Your Role</h2>
                <p className="text-sm text-muted-foreground">
                  Choose your role to access the appropriate dashboard
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.entries(USER_ROLES) as [UserRole, { label: string; description: string }][]).map(
                  ([role, { label, description }]) => (
                    <Card
                      key={role}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                      onClick={() => handleRoleSelect(role)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            {roleIcons[role]}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{label}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Demo mode: All roles use pre-filled credentials for demonstration purposes
              </p>
            </div>
          ) : (
            // Login Form
            <Card className="max-w-md mx-auto">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {roleIcons[selectedRole]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{USER_ROLES[selectedRole].label}</CardTitle>
                    <CardDescription>Sign in to continue</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Email / Username</Label>
                    <Input
                      id="username"
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Demo Mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Credentials are pre-filled. Click Sign In to access the demo dashboard.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        Ministry of Health and Wellness | Republic of Botswana
      </footer>
    </div>
  )
}
