"use client"

import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import type { UserRole } from "@/lib/data"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  role: UserRole
  title: string
  subtitle?: string
  alertCount?: number
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({
  role,
  title,
  subtitle,
  alertCount = 0,
  children,
  className,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={title} 
          subtitle={subtitle} 
          alertCount={alertCount}
          userRole={role}
        />
        <main className={cn(
          "flex-1 overflow-y-auto p-6",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}

// Section component for organizing dashboard content
interface DashboardSectionProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  actions,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

// Grid layouts for dashboard
export function DashboardGrid({ 
  children, 
  columns = 2,
  className 
}: { 
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string 
}) {
  const colClasses = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  }

  return (
    <div className={cn(
      "grid gap-6 md:grid-cols-2",
      colClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}
