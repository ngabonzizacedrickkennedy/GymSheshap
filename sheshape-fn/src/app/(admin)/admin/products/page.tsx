'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { formatPrice } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

// Icons
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Copy,
  Trash,
  Eye,
  Check,
  X,
  ArrowUpDown,
  EyeOff,
  Tag
} from 'lucide-react';

// Types
import { Product } from '@/types/models';

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [itemsPerPage] = useState(10);
  
  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortDirection, categoryFilter, stockFilter, statusFilter]);
  
  // Parse URL search params on component mount
  useEffect(() => {
    const page = searchParams.get('page');
    const sort = searchParams.get('sort');
    const direction = searchParams.get('direction');
    const category = searchParams.get('category');
    const stock = searchParams.get('stock');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    if (page) setCurrentPage(parseInt(page));
    if (sort) setSortField(sort);
    if (direction) setSortDirection(direction as 'asc' | 'desc');
    if (category) setCategoryFilter(category);
    if (stock) setStockFilter(stock);
    if (status) setStatusFilter(status);
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);
  
  // Apply search filter when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.categories && product.categories.some(category => 
          category.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);
  
  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const allCategories = products.flatMap(product => product.categories || []);
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    } else {
      // Fetch categories directly if no products are loaded yet
      fetchCategories();
    }
  }, [products]);
  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/product-categories');
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories as fallback
      setCategories([
        'Nutrition',
        'Supplements',
        'Protein',
        'Fitness Equipment',
        'Workout Clothes',
        'Leggings',
        'Sports Bras',
        'Yoga Accessories',
        'Recovery',
        'Other'
      ]);
    }
  };
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', (currentPage - 1).toString()); // API uses 0-based pagination
      params.append('size', itemsPerPage.toString());
      params.append('sort', `${sortField},${sortDirection}`);
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      
      if (stockFilter !== 'all') {
        params.append('inStock', stockFilter === 'in-stock' ? 'true' : 'false');
      }
      
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false');
      }
      
      if (searchQuery.trim() !== '') {
        params.append('search', searchQuery);
      }
      
      const response = await api.get(`/api/products?${params.toString()}`);
      setProducts(response.data.content);
      setFilteredProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    updateSearchParams();
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortDirection('desc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
    updateSearchParams();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
  };
  
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };
  
  const handleToggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Deactivate product
        await api.put(`/api/products/${productId}/deactivate`);
        toast.info('Product deactivated');
      } else {
        // Activate product
        await api.put(`/api/products/${productId}/activate`);
        toast.success('Product activated');
      }
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product status:', error);
      toast.error('Failed to update product status. Please try again.');
    }
  };
  
  const updateSearchParams = (page = currentPage) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sortField);
    params.append('direction', sortDirection);
    
    if (categoryFilter !== 'all') {
      params.append('category', categoryFilter);
    }
    
    if (stockFilter !== 'all') {
      params.append('stock', stockFilter);
    }
    
    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    
    if (searchQuery.trim() !== '') {
      params.append('search', searchQuery);
    }
    
    router.push(`/admin/products?${params.toString()}`);
  };
  
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Get the main image URL for a product
  const getMainImageUrl = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    // Find the main image
    const mainImage = product.images.find(img => img.isMain);
    
    // If there's a main image, return its URL; otherwise, return the first image's URL
    return mainImage ? mainImage.imageUrl : product.images[0].imageUrl;
  };
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(itemsPerPage).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-6" /></TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your store products
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                  updateSearchParams(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={stockFilter}
                onValueChange={(value) => {
                  setStockFilter(value);
                  setCurrentPage(1);
                  updateSearchParams(1);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                  updateSearchParams(1);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Product 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      {getSortIndicator('name')}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      Price 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      {getSortIndicator('price')}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('inventoryCount')}
                    >
                      Stock 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      {getSortIndicator('inventoryCount')}
                    </div>
                  </TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      Created 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                      {getSortIndicator('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletons()
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 relative rounded overflow-hidden bg-neutral-100">
                            {getMainImageUrl(product) ? (
                              <Image
                                src={getMainImageUrl(product) as string}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {product.discountPrice ? (
                            <>
                              <span className="font-medium">{formatPrice(product.discountPrice)}</span>
                              <span className="text-xs text-muted-foreground line-through ml-1">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={product.inventoryCount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.inventoryCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.categories && product.categories.length > 0 ? (
                            product.categories.slice(0, 2).map((category, index) => (
                              <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-800">
                                <Tag className="mr-1 h-3 w-3" />
                                {category}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-neutral-400">No categories</span>
                          )}
                          {product.categories && product.categories.length > 2 && (
                            <Badge variant="outline" className="bg-neutral-100 text-neutral-800">
                              +{product.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.isActive ? 'default' : 'outline'}
                          className={product.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-100'}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/new?duplicate=${product.id}`}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Duplicate</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleProductStatus(product.id, product.isActive)}
                            >
                              {product.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first and last pages, current page, and pages around current page
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis where pages are skipped
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        );
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}