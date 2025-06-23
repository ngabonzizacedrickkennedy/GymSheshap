// src/app/(admin)/admin/products/new/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/products/ProductForm';

export default function CreateProductPage() {
  const searchParams = useSearchParams();
  const duplicateFromId = searchParams.get('duplicate') 
    ? parseInt(searchParams.get('duplicate')!) 
    : undefined;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {duplicateFromId ? 'Duplicate Product' : 'Create New Product'}
        </h2>
        <p className="text-muted-foreground">
          {duplicateFromId 
            ? 'Create a new product based on an existing one' 
            : 'Add a new product to your store'
          }
        </p>
      </div>
      
      <ProductForm duplicateFromId={duplicateFromId} />
    </div>
  );
}