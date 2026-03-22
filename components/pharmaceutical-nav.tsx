'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Pill,
  Package,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/medicines',
    label: 'Medicine Catalog',
    icon: Pill,
    description: 'Search and browse pharmaceutical medicines',
  },
  {
    href: '/inventory',
    label: 'Inventory Management',
    icon: Package,
    description: 'Monitor stock levels across facilities',
  },
  {
    href: '/analytics',
    label: 'Analytics Dashboard',
    icon: BarChart3,
    description: 'View consumption and pricing trends',
  },
];

export function PharmaceuticalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Pharmaceutical System
      </p>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={item.description}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function PharmaceuticalNavCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="p-4 rounded-lg border border-border hover:border-primary bg-card hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {item.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
