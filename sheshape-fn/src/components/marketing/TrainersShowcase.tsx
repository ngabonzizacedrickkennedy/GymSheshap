'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

// Sample data for featured trainers
const trainers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Strength & HIIT Coach',
    bio: 'Former Olympic athlete specializing in strength training and high-intensity workouts with 10+ years of coaching experience.',
    image: '/images/trainers/trainer-1.jpg',
    specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    role: 'Yoga & Pilates Instructor',
    bio: 'Certified yoga instructor with expertise in flexibility, mindfulness, and holistic wellness for women of all ages.',
    image: '/images/trainers/trainer-2.jpg',
    specialties: ['Yoga', 'Pilates', 'Flexibility'],
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 3,
    name: 'Jessica Chen',
    role: 'Nutrition & Fitness Coach',
    bio: 'Registered dietitian and certified personal trainer specializing in women\'s nutrition and sustainable fitness approaches.',
    image: '/images/trainers/trainer-3.jpg',
    specialties: ['Nutrition', 'Weight Management', 'Functional Training'],
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 4,
    name: 'Taylor Williams',
    role: 'Cardio & Dance Coach',
    bio: 'Professional dancer turned fitness instructor with energetic cardio dance programs that make fitness fun and accessible.',
    image: '/images/trainers/trainer-4.jpg',
    specialties: ['Dance Fitness', 'Cardio', 'Toning'],
    social: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function TrainersShowcase() {
  const [activeTrainer, setActiveTrainer] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Expert Trainers</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Our certified trainers are dedicated to helping you achieve your fitness goals
            with personalized guidance and expert knowledge.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.id}
              variants={itemVariants}
              onMouseEnter={() => setActiveTrainer(trainer.id)}
              onMouseLeave={() => setActiveTrainer(null)}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-in-out"
                    style={{
                      transform: activeTrainer === trainer.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  
                  {/* Trainer info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{trainer.name}</h3>
                    <p className="text-sm opacity-90">{trainer.role}</p>
                  </div>
                  
                  {/* Social media icons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <a
                      href={trainer.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
                    >
                      <Instagram size={16} className="text-neutral-800" />
                    </a>
                    <a
                      href={trainer.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
                    >
                      <Twitter size={16} className="text-neutral-800" />
                    </a>
                    <a
                      href={trainer.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
                    >
                      <Linkedin size={16} className="text-neutral-800" />
                    </a>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <p className="text-sm text-neutral-600 mb-4">{trainer.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5 text-primary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button asChild variant="outline" size="sm" className="w-full group">
                    <Link href={`/trainers/${trainer.id}`}>
                      View Profile
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/trainers">
              View All Trainers
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}