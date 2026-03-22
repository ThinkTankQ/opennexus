'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, DollarSign, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Link from 'next/link';

interface Medicine {
  id: string;
  nappi_code: string;
  medicine_name: string;
  generic_name: string;
  strength: string;
  form: string;
  manufacturer: string;
  atc_code: string;
  is_essential_medicine: boolean;
  ddd_value: number;
  ddd_unit: string;
  storage_requirements: string;
  shelf_life_months: number;
}

interface PricingInfo {
  id: string;
  unit_price: number;
  currency: string;
  pack_size: number;
  supplier_name: string;
  price_date: string;
}

interface StockInfo {
  facility_name: string;
  quantity_on_hand: number;
  stock_status: string;
  reorder_level: number;
  expiry_date: string;
}

export default function MedicineDetail({ params }: { params: { id: string } }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pricing, setPricing] = useState<PricingInfo[]>([]);
  const [stock, setStock] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicineDetails();
  }, [params.id]);

  const fetchMedicineDetails = async () => {
    try {
      setLoading(true);

      // Fetch medicine
      const medResponse = await fetch(`/api/medicines?search=${params.id}`);
      const medData = await medResponse.json();
      setMedicine(medData.data?.[0]);

      // Fetch pricing
      const priceResponse = await fetch(
        `/api/medicine-pricing?medicine_id=${params.id}`
      );
      const priceData = await priceResponse.json();
      setPricing(priceData);

      // Fetch stock
      const stockResponse = await fetch(
        `/api/facility-stock?medicine_id=${params.id}`
      );
      const stockData = await stockResponse.json();
      setStock(stockData);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/medicines">
            <Button variant="ghost" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Medicines
            </Button>
          </Link>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Medicine not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/medicines">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Medicines
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {medicine.medicine_name}
              </h1>
              <p className="text-lg text-muted-foreground">{medicine.generic_name}</p>
            </div>
            {medicine.is_essential_medicine && (
              <Badge className="bg-red-100 text-red-800">Essential Medicine</Badge>
            )}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Strength</p>
            <p className="text-lg font-semibold text-foreground">{medicine.strength}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Form</p>
            <p className="text-lg font-semibold text-foreground">{medicine.form}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">ATC Code</p>
            <p className="text-lg font-semibold text-foreground font-mono">{medicine.atc_code}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">NAPPI Code</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {medicine.nappi_code}
            </p>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="info" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Manufacturer</p>
                  <p className="text-foreground">{medicine.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shelf Life</p>
                  <p className="text-foreground">
                    {medicine.shelf_life_months} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">DDD Value</p>
                  <p className="text-foreground">
                    {medicine.ddd_value} {medicine.ddd_unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ATC Classification</p>
                  <p className="text-foreground">{medicine.atc_code}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Storage Requirements
              </h3>
              <p className="text-foreground">{medicine.storage_requirements}</p>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="p-6">
              {pricing.length > 0 ? (
                <div className="space-y-4">
                  {pricing.map((price) => (
                    <div
                      key={price.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{price.supplier_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Pack size: {price.pack_size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {new Date(price.price_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {price.currency} {price.unit_price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">per unit</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No pricing information available</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card className="p-6">
              {stock.length > 0 ? (
                <div className="space-y-4">
                  {stock.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{s.facility_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Reorder Level: {s.reorder_level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {s.quantity_on_hand}
                        </p>
                        <Badge
                          className={
                            s.stock_status === 'ADEQUATE'
                              ? 'bg-green-100 text-green-800'
                              : s.stock_status === 'LOW_STOCK'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }
                        >
                          {s.stock_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No stock information available</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <Button size="lg" className="w-full">
          Add to Facility
        </Button>
      </div>
    </div>
  );
}
