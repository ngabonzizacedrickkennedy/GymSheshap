'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { productService } from '@/services/productService';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Icons
import { 
  Upload, 
  Save, 
  ArrowLeft, 
  Trash, 
  AlertTriangle,
  ImageIcon,
  DollarSign,
  Star,
  X,
  GripVertical
} from 'lucide-react';

import { ProductImage } from '@/types/models';

// Product schema using zod
const productSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  discountPrice: z.coerce.number().min(0, { message: 'Discount price must be a positive number' }).optional().nullable(),
  inventoryCount: z.coerce.number().min(0, { message: 'Inventory count must be a positive number' }),
  // Change to categories array
  categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: number;
  duplicateFromId?: number;
}

// Sortable Image Item component
const SortableImageItem = ({ image, index, removeImage, setMainImage }: { 
  image: ProductImage; 
  index: number; 
  removeImage: (index: number) => void; 
  setMainImage: (index: number) => void; 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `image-${image.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-md ${image.isMain ? 'border-primary' : 'border-neutral-200'}`}
    >
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-move bg-white rounded-full p-1 z-10"
      >
        <GripVertical className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="aspect-square relative">
        <Image
          src={image.imageUrl}
          alt={`Product image ${index + 1}`}
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-7 w-7"
            onClick={() => removeImage(index)}
          >
            <Trash className="h-3 w-3" />
          </Button>
          {!image.isMain && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-white"
              onClick={() => setMainImage(index)}
            >
              <Star className="h-3 w-3" />
            </Button>
          )}
        </div>
        {image.isMain && (
          <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Main Image
          </div>
        )}
      </div>
    </div>
  );
};

export function ProductForm({ productId, duplicateFromId }: ProductFormProps) {
  const router = useRouter();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  // DND sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discountPrice: null,
      inventoryCount: 0,
      categories: [],
      isActive: true,
    },
  });
  
  // Fetch product data if editing or duplicating
  useEffect(() => {
    const fetchProduct = async (id: number) => {
      setIsFetchingProduct(true);
      try {
        const productData = await productService.getProduct(id);
        
        // Populate form with product data
        setValue('name', duplicateFromId ? `${productData.name} (Copy)` : productData.name);
        setValue('description', productData.description || '');
        setValue('price', productData.price);
        setValue('discountPrice', productData.discountPrice || null);
        setValue('inventoryCount', productData.inventoryCount);
        setValue('categories', productData.categories);
        setValue('isActive', duplicateFromId ? true : productData.isActive);
        
        // Set product images
        if (productData.images && productData.images.length > 0) {
          setProductImages(duplicateFromId ? [] : productData.images);
        }
        
        // Set selected categories
        setSelectedCategories(productData.categories);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product data. Please try again.');
      } finally {
        setIsFetchingProduct(false);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const categories = await productService.getProductCategories();
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories if API fails
        setAvailableCategories(['Clothing', 'Equipment', 'Accessories', 'Nutrition', 'Other']);
      }
    };
    
    fetchCategories();
    
    if (productId) {
      fetchProduct(productId);
    } else if (duplicateFromId) {
      fetchProduct(duplicateFromId);
    }
  }, [productId, duplicateFromId, setValue]);
  
  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Make sure at least one image is selected
      if (productImages.length === 0) {
        setError('At least one product image is required');
        setIsLoading(false);
        return;
      }
      
      // Make sure at least one category is selected
      if (selectedCategories.length === 0) {
        setError('At least one category is required');
        setIsLoading(false);
        return;
      }
      
      // Extract discountPrice from the form data
  const { discountPrice, ...otherData } = data;

  const finalData = {
    ...otherData,
    // Convert null to undefined for discountPrice
    discountPrice: discountPrice === null ? undefined : discountPrice,
    images: productImages,
    categories: selectedCategories
  };
      
      if (productId) {
        // Update existing product
        await productService.updateProduct(productId, finalData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await productService.createProduct(finalData);
        toast.success('Product created successfully');
      }
      
      // Redirect back to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      setError('Failed to save product. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsImageUploading(true);
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Make sure file is an image
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          continue;
        }
        
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          continue;
        }
        
        // Upload the image to S3
        const imageUrl = await productService.uploadProductImage(file);
        
        // Add to product images array
        setProductImages(prev => [
          ...prev, 
          {
            id: -1 * (prev.length + 1), // Temporary negative ID for new images
            productId: productId || -1,
            imageUrl,
            fileKey: imageUrl.split('/').pop() || '',
            isMain: prev.length === 0, // First image is main by default
            position: prev.length,
            createdAt: new Date().toISOString()
          }
        ]);
      }
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };
  
  // Handle image removal
  const removeImage = (imageIndex: number) => {
    setProductImages(prev => {
      const filtered = prev.filter((_, index) => index !== imageIndex);
      
      // If we removed the main image, set the first remaining image as main
      if (prev[imageIndex].isMain && filtered.length > 0) {
        filtered[0].isMain = true;
      }
      
      // Update positions
      return filtered.map((img, index) => ({
        ...img,
        position: index
      }));
    });
  };
  
  // Set an image as main
  const setMainImage = (imageIndex: number) => {
    setProductImages(prev => 
      prev.map((img, index) => ({
        ...img,
        isMain: index === imageIndex
      }))
    );
  };
  
  // Handle image reordering with DND
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setProductImages((items) => {
      const activeIndex = items.findIndex(item => `image-${item.id}` === active.id);
      const overIndex = items.findIndex(item => `image-${item.id}` === over.id);
      
      // Reorder the array
      const reordered = arrayMove(items, activeIndex, overIndex);
      
      // Update positions
      return reordered.map((item, index) => ({
        ...item,
        position: index
      }));
    });
  };
  
  // Add a category
  const addCategory = (category: string) => {
    if (!category) return;
    
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      setValue('categories', newCategories);
    }
    
    // Add custom category to available categories if it's not there
    if (!availableCategories.includes(category)) {
      setAvailableCategories(prev => [...prev, category]);
    }
    
    // Reset custom category input
    setCustomCategory('');
    setShowCustomCategory(false);
  };
  
  // Remove a category
  const removeCategory = (category: string) => {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    setValue('categories', newCategories);
  };
  
  if (isFetchingProduct) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Main information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className="min-h-[150px]"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categories <span className="text-red-500">*</span></Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {selectedCategories.map(category => (
                    <Badge key={category} className="px-2 py-1">
                      {category}
                      <Button 
                        variant="ghost" 
                        className="ml-1 h-4 w-4 p-0" 
                        onClick={() => removeCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {showCustomCategory ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Enter new category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addCategory(customCategory)}
                        disabled={!customCategory.trim()}
                      >
                        Add
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setShowCustomCategory(false);
                          setCustomCategory('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        onValueChange={(value) => {
                          if (value === 'custom') {
                            setShowCustomCategory(true);
                          } else {
                            addCategory(value);
                          }
                        }}
                        value=""
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories
                            .filter(cat => !selectedCategories.includes(cat))
                            .map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))
                          }
                          <SelectItem value="custom">Add Custom Category</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
                
                {errors.categories && (
                  <p className="text-red-500 text-sm">{errors.categories.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventoryCount">Inventory Count <span className="text-red-500">*</span></Label>
                <Input
                  id="inventoryCount"
                  type="number"
                  min="0"
                  {...register('inventoryCount')}
                  className={errors.inventoryCount ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.inventoryCount && (
                  <p className="text-red-500 text-sm">{errors.inventoryCount.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                      {...register('price')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`pl-10 ${errors.discountPrice ? 'border-red-500' : ''}`}
                      {...register('discountPrice')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.discountPrice && (
                    <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>
                  )}
                  
                  {watch('price') && watch('discountPrice') && Number(watch('price')) > 0 && (
                    <p className="text-sm text-primary font-medium mt-1">
                      {Math.round(((Number(watch('price')) - Number(watch('discountPrice'))) / Number(watch('price'))) * 100)}% discount
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Product images and settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                {productImages.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={productImages.map(img => `image-${img.id}`)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {productImages.map((image, index) => (
                          <SortableImageItem
                            key={`image-${image.id}`}
                            image={image}
                            index={index}
                            removeImage={removeImage}
                            setMainImage={setMainImage}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="w-full aspect-square bg-neutral-100 flex flex-col items-center justify-center mb-4 rounded-md">
                    <ImageIcon className="h-12 w-12 text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-600">No images uploaded</p>
                  </div>
                )}
                
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium w-full"
                >
                  {isImageUploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading || isImageUploading}
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  You can upload multiple images. Drag and drop to reorder. Click the star icon to set the main image.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => {
                    setValue('isActive', checked as boolean);
                  }}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Product is active and visible in shop
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {productId ? 'Update Product' : 'Create Product'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}