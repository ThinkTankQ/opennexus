'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  Edit2,
  MoreVertical,
  TrendingDown,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface InventoryItem {
  id: string;
  medicine_name: string;
  quantity_on_hand: number;
  reorder_level: number;
  maximum_stock_level: number;
  stock_status: string;
  facility_name: string;
  expiry_date: string;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);

  useEffect(() => {
    fetchInventory();
  }, [selectedFacility, searchTerm, statusFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFacility) params.append('facility_id', selectedFacility);

      const response = await fetch(`/api/facility-stock?${params}`);
      const data = await response.json();

      let items = data || [];

      // Client-side filtering
      if (searchTerm) {
        items = items.filter((i: any) =>
          i.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter) {
        items = items.filter((i: any) => i.stock_status === statusFilter);
      }

      setInventory(items);

      // Extract unique facilities
      const uniqueFacilities = [...new Set(items.map((i: any) => i.facility_name))];
      setFacilities(uniqueFacilities);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ADEQUATE':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'STOCKOUT':
        return 'bg-red-100 text-red-800';
      case 'EXPIRY_SOON':
        return 'bg-orange-100 text-orange-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalItems = inventory.filter(
    (item) => item.stock_status === 'STOCKOUT' || item.stock_status === 'LOW_STOCK'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage medicine stock levels across facilities
          </p>
        </div>

        {/* Alert Summary */}
        {criticalItems > 0 && (
          <Card className="p-4 mb-8 border-l-4 border-l-red-500 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">
                  {criticalItems} items require attention
                </p>
                <p className="text-sm text-red-800">
                  Review low stock and stockout items to prevent supply disruptions
                </p>
              </div>
              <Button size="sm" className="ml-auto">View Critical Items</Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={selectedFacility} onValueChange={setSelectedFacility}>
            <SelectTrigger>
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Facilities</SelectItem>
              {facilities.map((facility) => (
                <SelectItem key={facility} value={facility}>
                  {facility}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="ADEQUATE">Adequate</SelectItem>
              <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
              <SelectItem value="STOCKOUT">Stockout</SelectItem>
              <SelectItem value="EXPIRY_SOON">Expiry Soon</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Inventory Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : inventory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Reorder Level</TableHead>
                  <TableHead className="text-center">Max Level</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Expiry Date</TableHead>
                  <TableHead className="text-center">Facility</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      {item.medicine_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-foreground">
                        {item.quantity_on_hand}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.reorder_level}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.maximum_stock_level}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(item.stock_status)}>
                        {item.stock_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {item.expiry_date
                        ? new Date(item.expiry_date).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {item.facility_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Package className="w-4 h-4" />
                            Log Dispensing
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <TrendingDown className="w-4 h-4" />
                            View Trends
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No inventory items found
              </h3>
              <p className="text-muted-foreground mb-4">
                Add medicines to your facility inventory to track stock levels
              </p>
              <Button>Add First Item</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
