'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

interface BlogImageUploadProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
}

export function BlogImageUpload({ imageUrl, onImageUploaded }: BlogImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Open file selector
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should not exceed 5MB');
      return;
    }
    
    // Display preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the image
    await uploadImage(file);
  };
  
  // Upload image to server
 // Update BlogImageUpload.tsx

// Upload image to server
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    setIsUploading(true);
    
    // Use the S3 upload endpoint
    const response = await api.post('/api/uploads/blog-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Get the image URL from the response
    const uploadedImageUrl = response.data.imageUrl;
    
    // Call the parent component's callback with the uploaded image URL
    onImageUploaded(uploadedImageUrl);
    
    toast.success('Image uploaded successfully');
  } catch (error) {
    console.error('Failed to upload image:', error);
    toast.error('Failed to upload image');
    
    // Remove preview on error
    setPreviewUrl(imageUrl || null);
  } finally {
    setIsUploading(false);
  }
};
  
  // Remove image
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <CardContent className="pt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Featured Image</h3>
        <p className="text-sm text-muted-foreground">
          Upload an image to appear as the featured image for your blog post.
          Recommended size: 1200 x 630 pixels.
        </p>
        
        {/* Image preview area */}
        <div className="mt-4 flex justify-center">
          {previewUrl ? (
            <div className="relative">
              <div className="relative aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl}
                  alt="Blog post featured image"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-3 -top-3 h-9 w-9 rounded-full"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ) : (<div
            className="flex aspect-[16/9] w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12"
            onClick={handleSelectFile}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="rounded-full bg-primary/10 p-4">
                <ImagePlus className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          </div>
          )}
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          {/* Upload button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSelectFile}
              disabled={isUploading}
              variant="outline"
              className="w-full max-w-xs"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {previewUrl ? 'Change Image' : 'Upload Image'}
                </>
              )}
            </Button>
          </div>
          </div>
          </CardContent>
          );
          }