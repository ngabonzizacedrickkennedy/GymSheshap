'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: '10 Effective Strength Training Exercises for Women',
    excerpt: 'Discover the most effective strength training exercises designed specifically for women\'s physiology and fitness goals.',
    image: '/images/blog/strength-training.jpg',
    category: 'Fitness',
    author: 'Sarah Johnson',
    authorRole: 'Strength Coach',
    authorImage: '/images/trainers/trainer-1.jpg',
    date: '2025-03-10T10:00:00',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Nutrition Tips for Sustainable Weight Management',
    excerpt: 'Learn how to create balanced, sustainable eating habits that support your fitness goals without restrictive dieting.',
    image: '/images/blog/nutrition.jpg',
    category: 'Nutrition',
    author: 'Jessica Chen',
    authorRole: 'Registered Dietitian',
    authorImage: '/images/trainers/trainer-3.jpg',
    date: '2025-03-08T14:30:00',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'How Yoga Improves Mental and Physical Wellness',
    excerpt: 'Explore the many benefits of incorporating yoga into your fitness routine for both mental clarity and physical strength.',
    image: '/images/blog/yoga.jpg',
    category: 'Wellness',
    author: 'Maria Rodriguez',
    authorRole: 'Yoga Instructor',
    authorImage: '/images/trainers/trainer-2.jpg',
    date: '2025-03-05T09:15:00',
    readTime: '7 min read',
  },
];

// Animation variants for staggered card animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// Function to get badge color based on category
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'fitness':
      return 'bg-primary/10 text-primary';
    case 'nutrition':
      return 'bg-green-100 text-green-800';
    case 'wellness':
      return 'bg-accent1/20 text-accent1-800';
    case 'motivation':
      return 'bg-accent2/20 text-accent2-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

export function BlogPreview() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Expert advice, tips, and insights for your fitness journey and overall wellness.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredId === post.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent" />
                  <Badge 
                    className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="pt-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    <Link 
                      href={`/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center mb-2">
                    <div className="relative h-8 w-8 rounded-full mr-3 overflow-hidden">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{post.author}</div>
                      <div className="text-xs text-neutral-500">{post.authorRole}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-neutral-500">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-primary font-medium text-sm flex items-center hover:underline"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}