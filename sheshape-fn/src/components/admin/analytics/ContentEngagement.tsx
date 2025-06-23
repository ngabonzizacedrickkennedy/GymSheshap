// src/components/admin/analytics/ContentEngagement.tsx
'use client';

import Link from 'next/link';
import { BarChart2, Eye, Users, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentEngagementProps {
  data: {
    topBlogs: Array<{
      id: number;
      title: string;
      views: number;
    }>;
    topPrograms: Array<{
      id: number;
      title: string;
      enrollments: number;
    }>;
  };
}

export function ContentEngagement({ data }: ContentEngagementProps) {
  return (
    <Tabs defaultValue="blogs" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="blogs" className="flex-1">Blog Content</TabsTrigger>
        <TabsTrigger value="programs" className="flex-1">Programs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="blogs" className="pt-4">
        <div className="space-y-4">
          {data.topBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className="flex items-center p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-grow">
                <h4 className="font-medium line-clamp-1">{blog.title}</h4>
                <div className="flex items-center text-sm text-neutral-500">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  {blog.views.toLocaleString()} views
                </div>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/blog/edit/${blog.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/admin/blog">
              View All Blog Posts
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="programs" className="pt-4">
        <div className="space-y-4">
          {data.topPrograms.map((program) => (
            <div 
              key={program.id} 
              className="flex items-center p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-accent1/10 flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-accent1" />
              </div>
              
              <div className="flex-grow">
                <h4 className="font-medium line-clamp-1">{program.title}</h4>
                <div className="flex items-center text-sm text-neutral-500">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {program.enrollments.toLocaleString()} enrollments
                </div>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/programs/edit/${program.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/admin/programs">
              View All Programs
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}