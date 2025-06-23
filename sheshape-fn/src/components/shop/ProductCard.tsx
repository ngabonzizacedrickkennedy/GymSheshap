'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/models'; // Import from models.ts

interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
  onToggleFavorite?: (productId: number) => void;
}

export function ProductCard({ 
  product, 
  isFavorited = false,
  onToggleFavorite,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem(product);
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <Card 
      className="h-full overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/shop/products/${product.id}`}>
          <Image 
            src={product.imageUrl || '/images/product-placeholder.jpg'} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </Link>
        
        {/* Discount badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-accent1 text-white">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
              isFavorited 
                ? 'bg-white text-red-500' 
                : 'bg-white/80 text-neutral-500 hover:text-red-500'
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? (
              <Heart className="h-5 w-5 fill-red-500" />
            ) : (
              <Heart className="h-5 w-5" />
            )}
          </button>
        )}
        
        {/* Out of stock overlay */}
        {product.inventoryCount === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="outline" className="border-white text-white text-sm px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
        
        {/* Quick add to cart button */}
        {product.inventoryCount > 0 && (
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-white p-2 transform transition-transform ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary-600 text-sm py-1 h-8"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" /> Quick Add
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link 
          href={`/shop/products/${product.id}`}
          className="block mb-1 hover:text-primary transition-colors"
        >
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500 ml-1">(24)</span>
        </div>
        
        <div className="flex items-center mt-1">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-lg">{formatPrice(product.discountPrice!)}</span>
              <span className="text-neutral-500 text-sm line-through ml-2">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.inventoryCount === 0 || isAddingToCart}
          variant={product.inventoryCount === 0 ? 'outline' : 'default'}
        >
          {product.inventoryCount === 0 ? (
            'Out of Stock'
          ) : isAddingToCart ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></div>
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}