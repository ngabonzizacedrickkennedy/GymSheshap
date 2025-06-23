// src/app/(admin)/admin/products/edit/[id]/page.tsx
'use client';

import { ProductForm } from '@/components/admin/products/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">
          Update your product information
        </p>
      </div>
      
      <ProductForm productId={productId} />
    </div>
  );
}