'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { Skeleton } from '@/components/ui/skeleton';

interface Medicine {
  id: string;
  nappi_code: string;
  medicine_name: string;
  generic_name: string;
  strength: string;
  form: string;
  manufacturer: string;
  is_essential_medicine: boolean;
}

export default function MedicinesCatalog() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    fetchMedicines();
  }, [searchTerm]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', '100');

      const response = await fetch(`/api/medicines?${params}`);
      const data = await response.json();
      setMedicines(data.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = medicines;

    if (selectedForm) {
      filtered = filtered.filter((m) => m.form === selectedForm);
    }

    setFilteredMedicines(filtered);
  }, [medicines, selectedForm]);

  const forms = [...new Set(medicines.map((m) => m.form))];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Medicine Catalog</h1>
          <p className="text-muted-foreground">
            Search and manage pharmaceutical medicines available in your facility
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, generic name, or NAPPI code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Forms</SelectItem>
              {forms.map((form) => (
                <SelectItem key={form} value={form}>
                  {form}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mb-6 p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredMedicines.length}</span> of{' '}
            <span className="font-semibold text-foreground">{medicines.length}</span> medicines
          </p>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              ))}
            </>
          ) : filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <div key={medicine.id}>
                <a href={`/medicines/${medicine.id}`} className="block">
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                          {medicine.medicine_name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {medicine.generic_name}
                        </p>
                      </div>
                      {medicine.is_essential_medicine && (
                        <Badge className="ml-2 bg-red-100 text-red-800">Essential</Badge>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Strength:</span>
                        <span className="ml-2 font-medium text-foreground">{medicine.strength}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Form:</span>
                        <span className="ml-2 font-medium text-foreground">{medicine.form}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">NAPPI Code:</span>
                        <span className="ml-2 font-mono text-foreground text-xs bg-muted px-2 py-1 rounded">
                          {medicine.nappi_code}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="ml-2 font-medium text-foreground line-clamp-1">
                          {medicine.manufacturer}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No medicines found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
