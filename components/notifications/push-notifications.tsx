"use client"

import { useState, useEffect } from "react"
import { Bell, X, AlertTriangle, Package, Users, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PUSH_NOTIFICATIONS, type PushNotification, type UserRole } from "@/lib/data"
import Link from "next/link"

interface NotificationBellProps {
  userRole?: UserRole
}

const notificationIcons: Record<PushNotification["type"], React.ReactNode> = {
  "stock-critical": <Package className="h-4 w-4" />,
  "patient-missed": <Users className="h-4 w-4" />,
  "expiry-imminent": <Clock className="h-4 w-4" />,
  "outbreak-detected": <Activity className="h-4 w-4" />,
  "shipment-delayed": <AlertTriangle className="h-4 w-4" />,
}

export function NotificationBell({ userRole = "cms" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [latestNotification, setLatestNotification] = useState<PushNotification | null>(null)

  useEffect(() => {
    // Filter notifications for this user role
    const roleNotifications = PUSH_NOTIFICATIONS.filter(n => 
      n.targetRoles.includes(userRole)
    )
    setNotifications(roleNotifications)

    // Show toast for unread critical notifications
    const unreadCritical = roleNotifications.find(n => !n.read && n.severity === "critical")
    if (unreadCritical) {
      setLatestNotification(unreadCritical)
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [userRole])

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => !n.read && n.severity === "critical").length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && latestNotification && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className={`max-w-sm p-4 rounded-lg shadow-lg border ${
            latestNotification.severity === "critical"
              ? "bg-destructive/10 border-destructive/50"
              : "bg-accent/10 border-accent/50"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                latestNotification.severity === "critical" ? "bg-destructive/20" : "bg-accent/20"
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  latestNotification.severity === "critical" ? "text-destructive" : "text-accent-foreground"
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{latestNotification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{latestNotification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowToast(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {latestNotification.actionUrl && (
              <Link href={latestNotification.actionUrl}>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Bell Icon with Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center text-white ${
                criticalCount > 0 ? "bg-destructive animate-pulse" : "bg-primary"
              }`}>
                {unreadCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
            <SheetDescription className="sr-only">
              View and manage your system notifications and alerts
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            <div className="space-y-3 pr-4">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      !notification.read
                        ? notification.severity === "critical"
                          ? "bg-destructive/5 border-destructive/30"
                          : "bg-accent/5 border-accent/30"
                        : "bg-muted/30 border-border"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full shrink-0 ${
                        notification.severity === "critical"
                          ? "bg-destructive/10"
                          : notification.severity === "warning"
                          ? "bg-accent/10"
                          : "bg-muted"
                      }`}>
                        <span className={
                          notification.severity === "critical"
                            ? "text-destructive"
                            : notification.severity === "warning"
                            ? "text-accent-foreground"
                            : "text-muted-foreground"
                        }>
                          {notificationIcons[notification.type]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{notification.title}</p>
                          {!notification.read && (
                            <Badge 
                              variant={notification.severity === "critical" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.actionUrl && (
                            <Link href={notification.actionUrl}>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                View details
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
