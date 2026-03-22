"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { NotificationBell } from "@/components/notifications/push-notifications"
import type { UserRole } from "@/lib/data"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  alertCount?: number
  showSearch?: boolean
  showNavigation?: boolean
  userRole?: UserRole
  className?: string
}

export function DashboardHeader({
  title,
  subtitle,
  alertCount = 0,
  showSearch = true,
  showNavigation = true,
  userRole = "cms",
  className,
}: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <header className={cn(
      "flex items-center justify-between px-6 py-4 bg-card border-b",
      className
    )}>
      <div className="flex items-center gap-4">
        {/* Navigation Buttons */}
        {showNavigation && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
              title="Go Back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go Back</span>
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                title="Go to Home"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Go to Home</span>
              </Button>
            </Link>
          </div>
        )}
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines, facilities..."
              className="pl-9 w-64 bg-muted/50"
            />
          </div>
        )}

        <NotificationBell userRole={userRole} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
