'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Clock, Dumbbell, Users, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Sample data for featured programs
const featuredPrograms = [
  {
    id: 1,
    title: 'Total Body Transformation',
    description: 'A complete 12-week program designed to transform your body and boost your fitness level.',
    image: '/images/programs/program-1.jpg',
    price: 149.99,
    level: 'Intermediate',
    duration: '12 weeks',
    participants: 1250,
    category: 'strength',
  },
  {
    id: 2,
    title: 'HIIT & Cardio Blast',
    description: 'High-intensity interval training combined with cardio for maximum fat burning results.',
    image: '/images/programs/program-2.jpg',
    price: 129.99,
    level: 'Advanced',
    duration: '8 weeks',
    participants: 980,
    category: 'cardio',
  },
  {
    id: 3,
    title: 'Yoga Flow & Flexibility',
    description: 'Improve your flexibility, balance, and mindfulness with our comprehensive yoga program.',
    image: '/images/programs/program-3.jpg',
    price: 99.99,
    level: 'Beginner',
    duration: '6 weeks',
    participants: 1500,
    category: 'yoga',
  },
  {
    id: 4,
    title: 'Core Strength Builder',
    description: 'Focus on building a strong core with targeted exercises and progressive overload.',
    image: '/images/programs/program-4.jpg',
    price: 119.99,
    level: 'Intermediate',
    duration: '10 weeks',
    participants: 850,
    category: 'strength',
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// Function to get badge color based on level
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200';
  }
};

export function FeaturedPrograms() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Programs</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Discover our most popular fitness programs designed specifically for women
            to help you achieve your health and wellness goals.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredPrograms.map((program) => (
            <motion.div
              key={program.id}
              variants={cardVariants}
              onMouseEnter={() => setHoveredId(program.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredId === program.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge
                    variant="outline"
                    className={`absolute top-3 left-3 ${getLevelColor(program.level)}`}
                  >
                    {program.level}
                  </Badge>
                </div>
                <CardHeader className="pt-5 pb-0">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="w-4 h-4 mr-1" />
                      <span>{program.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{program.participants.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-5 flex justify-between items-center">
                  <div className="font-bold text-lg text-primary">
                    {formatPrice(program.price)}
                  </div>
                  <Button asChild variant="outline" size="sm" className="group">
                    <Link href={`/programs/${program.id}`}>
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link href="/programs">
              View All Programs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}