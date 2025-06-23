// Product related types for the SheShape e-commerce platform

/**
 * Represents a product in the SheShape shop
 */
// src/types/models.ts - Updated Product interface
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  inventoryCount: number;
  // Change from imageUrl to images array
  images: ProductImage[];
  // Change from category string to categories array
  categories: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// New ProductImage interface
export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  fileKey: string;
  isMain: boolean; // To indicate the primary/featured image
  position: number; // For ordering images
  createdAt: string;
}
  
  /**
   * Represents a product category
   */
  export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
  }
  
  /**
   * Represents a product review
   */
  export interface ProductReview {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
  }
  
  /**
   * Represents a product in the shopping cart with quantity
   */
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  /**
   * Represents filters used for product search and browsing
   */
  export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
    page?: number;
    limit?: number;
    search?: string;
  }
  
  /**
   * Product sorting options
   */
  export type ProductSortOption = {
    label: string;
    value: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  };
  
  /**
   * Represents a paginated product response from the API
   */
  export interface PaginatedProducts {
    products: Product[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  }
  
  /**
   * Represents a product variant (e.g., different sizes, colors)
   */
  export interface ProductVariant {
    id: number;
    productId: number;
    name: string;
    sku: string;
    price?: number; // Override of base product price if applicable
    inventoryCount: number;
    attributes: {
      [key: string]: string; // e.g., { color: "black", size: "M" }
    };
  }
  
  /**
   * Product wishlist item
   */
  export interface WishlistItem {
    id: number;
    userId: number;
    productId: number;
    product?: Product;
    addedAt: string;
  }