'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPost {
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
}

interface BlogEditorProps {
  blogPost: BlogPost;
  onChange: (field: keyof BlogPost, value: string | boolean) => void;
}

// Blog categories
const BLOG_CATEGORIES = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'success_stories', label: 'Success Stories' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'workout', label: 'Workout Plans' },
];

export function BlogEditor({ blogPost, onChange }: BlogEditorProps) {
  const [editorView, setEditorView] = useState<'write' | 'preview'>('write');
  
  // Parse markdown for the preview (basic implementation)
  const parseMarkdown = (markdown: string) => {
    // This is a very basic markdown parser for preview
    // In a real application, you'd use a proper markdown library
    
    // Replace headers
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Replace bold and italic
    html = html
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Replace lists
    html = html
      .replace(/^\s*- (.*$)/gim, '<li>$1</li>')
      .replace(/<\/li>\n<li>/gim, '</li><li>');
    
    html = html.replace(/<li>(.+)<\/li>/gim, '<ul><li>$1</li></ul>');
    
    // Replace paragraphs (basic)
    html = html.replace(/\n\n/gim, '</p><p>');
    html = `<p>${html}</p>`;
    
    // Replace links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return html;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your post..."
                value={blogPost.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={blogPost.category}
                onValueChange={(value) => onChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="min-h-[500px] flex flex-col">
        <div className="border-b p-2">
          <Tabs value={editorView} onValueChange={(v) => setEditorView(v as 'write' | 'preview')}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 p-4">
          {editorView === 'write' ? (
            <Textarea
              placeholder="Write your blog post content here... (Markdown supported)"
              value={blogPost.content}
              onChange={(e) => onChange('content', e.target.value)}
              className="h-full min-h-[400px] resize-none border-0 focus-visible:ring-0 p-0"
            />
          ) : (
            <div
              className="prose prose-green max-w-none h-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(blogPost.content) }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}