'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carouse';

// Icons
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  ShoppingBag, 
  Package, 
  Calendar,
  DollarSign, 
  Tag,
  Clock,
  Check,
  X,
  AlertTriangle,
  Eye
} from 'lucide-react';

// Types
import { Product } from '@/types/models';
import { productService } from '@/services/productService';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = parseInt(params.id);
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product data. The product may have been deleted or does not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Product Not Found</h3>
            <p className="text-muted-foreground mb-4">{error || 'The requested product could not be found.'}</p>
            <Button asChild>
              <Link href="/admin/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get main image
  const mainImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.isMain) || product.images[0] 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/edit/${productId}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDeleteProduct}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product images */}
        <Card>
          <CardContent className="p-4">
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={image.id || index}>
                      <div className="aspect-square relative rounded-md overflow-hidden bg-neutral-100">
                        <Image
                          src={image.imageUrl}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                        {image.isMain && (
                          <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Main Image
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center rounded-md bg-neutral-100">
                <Package className="h-16 w-16 text-neutral-400" />
                <p className="mt-2 text-neutral-500">No image available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Product details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <Badge
                  variant={product.isActive ? 'default' : 'outline'}
                  className={product.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-100'}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product information */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-neutral-500">No categories</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inventory</p>
                    <p className={product.inventoryCount > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.inventoryCount} in stock
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Regular Price</p>
                    <p className="text-lg font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  
                  {product.discountPrice && (
                    <div>
                      <p className="text-sm text-muted-foreground">Discount Price</p>
                      <div>
                        <p className="text-lg font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatPrice(product.discountPrice)}
                        </p>
                        <p className="text-sm text-primary">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                {product.description ? (
                  <p className="whitespace-pre-line">{product.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">No description provided</p>
                )}
              </div>
              
              <Separator />
              
              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Public view and actions */}
          <Card>
            <CardHeader>
              <CardTitle>Shop Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <Link href={`/shop/product/${productId}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  View in Shop
                </Link>
              </Button>
              
              <Button asChild>
                <Link href={`/admin/products/edit/${productId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}