'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { BlogImageUpload } from '@/components/admin/blog/BlogImageUpload';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Eye, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPost {
  id?: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
}

export default function BlogEditPage({ 
  params 
}: { 
  params: { action: string; id: string } 
}) {
  const { action, id } = params;
  const isEditing = action === 'edit';
  const postId = isEditing ? parseInt(id) : null;
  
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    content: '',
    category: 'fitness',
    imageUrl: '',
    isPublished: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  const router = useRouter();

  // Fetch blog post if editing
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!isEditing) return;
      
      try {
        setIsLoading(true);
        const response = await api.get(`/api/blog/posts/${postId}`);
        setBlogPost(response.data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        toast.error('Failed to load blog post');
        router.push('/admin/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [isEditing, postId, router]);

  // Handle form input changes
  const handleInputChange = (field: keyof BlogPost, value: string | boolean) => {
    setBlogPost((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    handleInputChange('imageUrl', imageUrl);
  };

  // Save blog post
  const saveBlogPost = async (publish: boolean = false) => {
    if (!blogPost.title || !blogPost.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setIsSaving(true);
      
      // Set publish status if requested
      if (publish) {
        blogPost.isPublished = true;
      }
      
      let response;
      if (isEditing) {
        response = await api.put(`/api/blog/posts/${postId}`, blogPost);
      } else {
        response = await api.post('/api/blog/posts', blogPost);
      }
      
      toast.success(`Blog post ${isEditing ? 'updated' : 'created'} successfully`);
      
      // Publish if needed (for existing posts)
      if (publish && isEditing && !blogPost.isPublished) {
        await api.put(`/api/blog/posts/${postId}/publish`);
        toast.success('Blog post published');
      }
      
      // Redirect to blog listing
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to save blog post:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} blog post`);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview blog post
  const previewBlogPost = () => {
    // For a real implementation, this might save a draft and then open a preview page
    // For now, we'll just show a toast message
    toast.info('Preview functionality will be available soon');
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/admin/blog')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Blog Post' : 'Create Blog Post'}
            </h2>
            <p className="text-muted-foreground">
              {isEditing 
                ? 'Update your blog post and content' 
                : 'Create a new blog post for your audience'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={previewBlogPost}
            disabled={isSaving || !blogPost.title || !blogPost.content}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => saveBlogPost(false)}
            disabled={isSaving || !blogPost.title || !blogPost.content}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={() => saveBlogPost(true)}
            disabled={isSaving || !blogPost.title || !blogPost.content}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isSaving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="image">Featured Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <BlogEditor 
            blogPost={blogPost} 
            onChange={handleInputChange} 
          />
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <Card>
            <BlogImageUpload 
              imageUrl={blogPost.imageUrl} 
              onImageUploaded={handleImageUpload} 
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}