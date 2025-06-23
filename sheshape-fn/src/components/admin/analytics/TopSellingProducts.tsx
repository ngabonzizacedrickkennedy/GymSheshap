// src/components/admin/analytics/TopSellingProducts.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';

interface TopProduct {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  totalSales: number;
  revenue: number;
  growth: number;
  quantity: number;
}

interface TopSellingProductsProps {
  data: TopProduct[];
}

export function TopSellingProducts({ data }: TopSellingProductsProps) {
  const [view, setView] = useState('revenue');

  // Get proper sortKey based on the current view
  const getSortKey = (): keyof TopProduct => {
    switch (view) {
      case 'revenue':
        return 'revenue';
      case 'quantity':
        return 'quantity';
      case 'growth':
        return 'growth';
      default:
        return 'revenue';
    }
  };

  // Sort data based on the current view
  const sortedData = [...data].sort((a, b) => {
    const sortKey = getSortKey();
    // Use type assertion to inform TypeScript these are numbers
    return (b[sortKey] as number) - (a[sortKey] as number);
  });

  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={setView} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="revenue" className="flex-1">By Revenue</TabsTrigger>
          <TabsTrigger value="quantity" className="flex-1">By Quantity</TabsTrigger>
          <TabsTrigger value="growth" className="flex-1">By Growth</TabsTrigger>
        </TabsList>

        <TabsContent value={view} className="pt-4">
          <div className="space-y-4">
            {sortedData.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center p-3 border rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 relative h-12 w-12 rounded-md overflow-hidden mr-4">
                  <Image 
                    src={product.imageUrl || '/images/product-placeholder.jpg'} 
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-grow">
                  <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-neutral-500">{product.category}</p>
                </div>
                
                {/* Revenue/Quantity/Growth info based on view */}
                <div className="flex flex-col items-end ml-4 min-w-[100px]">
                  {view === 'revenue' && (
                    <>
                      <span className="font-semibold">{formatPrice(product.revenue)}</span>
                      <div className="flex items-center text-xs">
                        <span className={product.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.growth >= 0 ? (
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="inline h-3 w-3 mr-1" />
                          )}
                          {Math.abs(product.growth)}%
                        </span>
                      </div>
                    </>
                  )}
                  
                  {view === 'quantity' && (
                    <>
                      <span className="font-semibold">{product.quantity} units</span>
                      <span className="text-xs text-neutral-500">Total sold</span>
                    </>
                  )}
                  
                  {view === 'growth' && (
                    <>
                      <span className={`font-semibold ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                      <span className="text-xs text-neutral-500">{formatPrice(product.revenue)}</span>
                    </>
                  )}
                </div>
                
                {/* Navigate to product details */}
                <ChevronRight className="h-4 w-4 text-neutral-400 ml-2" />
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full mt-4" asChild>
            <Link href="/admin/products">View All Products</Link>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}