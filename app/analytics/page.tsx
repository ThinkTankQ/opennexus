'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalMedicines: number;
    lowStockCount: number;
    totalConsumption: number;
    priceIncreases: number;
    priceDecreases: number;
  };
  consumptionByMedicine: Array<{
    medicine_name: string;
    total_quantity: number;
    dispensing_count: number;
  }>;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#0ea5e9'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDays, setSelectedDays] = useState('30');
  const [facilities, setFacilities] = useState<string[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedFacility, selectedDays]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFacility) params.append('facility_id', selectedFacility);
      params.append('days', selectedDays);

      const response = await fetch(`/api/analytics?${params}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stockStatusData = data
    ? [
        { name: 'Adequate', value: data.summary.totalMedicines - data.summary.lowStockCount },
        { name: 'Low Stock', value: data.summary.lowStockCount },
      ]
    : [];

  const priceChangeData = data
    ? [
        { name: 'Increases', value: data.summary.priceIncreases },
        { name: 'Decreases', value: data.summary.priceDecreases },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor pharmaceutical data, consumption patterns, and pricing trends
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Select value={selectedFacility} onValueChange={setSelectedFacility}>
            <SelectTrigger>
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Facilities</SelectItem>
              <SelectItem value="central-hospital">Central Hospital</SelectItem>
              <SelectItem value="clinic-1">Primary Health Clinic</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDays} onValueChange={setSelectedDays}>
            <SelectTrigger>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button>Export Report</Button>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Medicines</p>
              <p className="text-3xl font-bold text-foreground">
                {data.summary.totalMedicines}
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-yellow-500">
              <p className="text-sm text-muted-foreground mb-2">Low Stock Items</p>
              <p className="text-3xl font-bold text-yellow-600">
                {data.summary.lowStockCount}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Consumption</p>
              <p className="text-3xl font-bold text-foreground">
                {data.summary.totalConsumption}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Price Increases</p>
              <p className="text-3xl font-bold text-red-600">
                {data.summary.priceIncreases}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Price Decreases</p>
              <p className="text-3xl font-bold text-green-600">
                {data.summary.priceDecreases}
              </p>
            </Card>
          </div>
        ) : null}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Consumption Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Top Consumed Medicines
            </h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : data?.consumptionByMedicine && data.consumptionByMedicine.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.consumptionByMedicine.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="medicine_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_quantity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No consumption data available
              </div>
            )}
          </Card>

          {/* Stock Status Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Stock Status</h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : stockStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No stock data available
              </div>
            )}
          </Card>
        </div>

        {/* Price Trends */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Price Changes</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : priceChangeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceChangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No price data available
            </div>
          )}
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Key Insight</p>
                <p className="font-semibold text-foreground">
                  Monitor consumption patterns to optimize stock levels
                </p>
              </div>
              <Package className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Action Required</p>
                <p className="font-semibold text-foreground">
                  Review pricing trends for cost optimization
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Alert</p>
                <p className="font-semibold text-foreground">
                  {data?.summary.lowStockCount ? `${data.summary.lowStockCount} items need restocking` : 'All stock levels adequate'}
                </p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
