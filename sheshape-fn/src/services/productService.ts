// src/services/productService.ts
import { api } from '@/lib/api';
import { Product, PaginatedProducts, ProductFilters } from '@/types/models';

export const productService = {
  // Get all products with pagination and filters
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.search) params.append('search', filters.search);
    
    // Add pagination parameters
    if (filters.page !== undefined) params.append('page', (filters.page - 1).toString()); // API uses 0-based pagination
    if (filters.limit) params.append('size', filters.limit.toString());
    
    // Add sorting
    if (filters.sort) {
      let field = 'createdAt';
      let direction = 'desc';
      
      switch (filters.sort) {
        case 'price_asc':
          field = 'price';
          direction = 'asc';
          break;
        case 'price_desc':
          field = 'price';
          direction = 'desc';
          break;
        case 'newest':
          field = 'createdAt';
          direction = 'desc';
          break;
        case 'popular':
          field = 'popularity';
          direction = 'desc';
          break;
      }
      
      params.append('sort', `${field},${direction}`);
    }
    
    const response = await api.get(`/api/products?${params.toString()}`);
    
    // Transform the Spring Boot paginated response to our format
    return {
      products: response.data.content,
      totalCount: response.data.totalElements,
      currentPage: response.data.number + 1, // Convert 0-based to 1-based
      totalPages: response.data.totalPages,
      hasMore: !response.data.last,
    };
  },
  
  // Get a single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
  
  // Create a new product (admin only)
  async createProduct(productData: Partial<Product>): Promise<Product> {
    // Format the product data correctly for the API
    const formattedData = {
      ...productData,
      // Format the images data if needed
      images: productData.images?.map(img => ({
        imageUrl: img.imageUrl,
        fileKey: img.fileKey,
        isMain: img.isMain,
        position: img.position
      }))
    };
    
    const response = await api.post('/api/products', formattedData);
    return response.data;
  },
  
  // Update an existing product (admin only)
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    // Format the product data correctly for the API
    const formattedData = {
      ...productData,
      // Format the images data if needed
      images: productData.images?.map(img => ({
        id: img.id > 0 ? img.id : undefined, // Only send existing image IDs
        imageUrl: img.imageUrl,
        fileKey: img.fileKey,
        isMain: img.isMain,
        position: img.position
      }))
    };
    
    const response = await api.put(`/api/products/${id}`, formattedData);
    return response.data;
  },
  
  // Delete a product (admin only)
  // Delete a product (admin only)
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },
  
  // Activate a product (admin only)
  async activateProduct(id: number): Promise<Product> {
    const response = await api.put(`/api/products/${id}/activate`);
    return response.data;
  },
  
  // Deactivate a product (admin only)
  async deactivateProduct(id: number): Promise<Product> {
    const response = await api.put(`/api/products/${id}/deactivate`);
    return response.data;
  },
  
  // Upload product image (admin only)
  // Update in src/services/productService.ts

// Update the uploadProductImage function
// Update in src/services/productService.ts

// Update the uploadProductImage function
async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    // Use the product-specific file upload endpoint
    const response = await api.post('/api/uploads/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Extract the image URL from the response
    return response.data.imageUrl;

  },  
  // Get product categories (admin and public)
  async getProductCategories(): Promise<string[]> {
    return this.getDefaultCategories();
    // try {
    //   // Try to fetch categories from API first
    //   const response = await api.get('/api/product-categories');
      
    //   // If API call succeeds, return the data
    //   if (response.data && Array.isArray(response.data) && response.data.length > 0) {
    //     return response.data;
    //   }
      
    //   // Fallback to predefined categories if API returns empty data
    //   return this.getDefaultCategories();
    // } catch (error) {
    //   // If API call fails, return default categories
    //   console.error('Failed to fetch product categories:', error);
      
    // }
  },
  
  // Helper method for default categories
   getDefaultCategories(): string[] {
    return [
      'Nutrition',
      'Supplements',
      'Protein',
      'Fitness Equipment',
      'Workout Clothes',
      'Leggings',
      'Sports Bras',
      'Yoga Accessories',
      'Resistance Bands',
      'Weights',
      'Recovery',
      'Hydration',
      'Books',
      'Digital Products',
      'Other'
    ];
  },
  
  // Update product inventory count (admin only)
  async updateInventory(id: number, count: number): Promise<boolean> {
    try {
      const response = await api.post(`/api/products/${id}/inventory`, { count });
      return response.data.success;
    } catch (error) {
      return false;
    }
  }
};