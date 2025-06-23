'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Emily Johnson',
    location: 'New York, NY',
    image: '/images/testimonials/testimonial-1.jpg',
    quote: 'SheShape completely transformed my approach to fitness. The programs are tailored perfectly for women, and I\'ve seen incredible progress both physically and mentally.',
    rating: 5,
    program: 'Total Body Transformation',
    beforeImage: '/images/testimonials/before-1.jpg',
    afterImage: '/images/testimonials/after-1.jpg',
  },
  {
    id: 2,
    name: 'Sophia Rodriguez',
    location: 'Miami, FL',
    image: '/images/testimonials/testimonial-2.jpg',
    quote: 'As a busy mom, finding time for fitness was always challenging. The flexibility of SheShape\'s programs and the supportive community made it possible for me to prioritize my health.',
    rating: 5,
    program: 'HIIT & Cardio Blast',
    beforeImage: '/images/testimonials/before-2.jpg',
    afterImage: '/images/testimonials/after-2.jpg',
  },
  {
    id: 3,
    name: 'Michelle Lee',
    location: 'Seattle, WA',
    image: '/images/testimonials/testimonial-3.jpg',
    quote: 'The nutrition plans combined with the workout programs gave me the complete package. I\'ve lost 30 pounds and gained confidence I never thought possible.',
    rating: 5,
    program: 'Core Strength Builder',
    beforeImage: '/images/testimonials/before-3.jpg',
    afterImage: '/images/testimonials/after-3.jpg',
  },
  {
    id: 4,
    name: 'Taylor Wilson',
    location: 'Austin, TX',
    image: '/images/testimonials/testimonial-4.jpg',
    quote: 'The trainers are incredibly knowledgeable and supportive. I\'ve tried many fitness platforms, but SheShape truly understands what women need to succeed.',
    rating: 5,
    program: 'Yoga Flow & Flexibility',
    beforeImage: '/images/testimonials/before-4.jpg',
    afterImage: '/images/testimonials/after-4.jpg',
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  // Navigate to previous testimonial
  const prev = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
    setAutoplay(false);
  };
  
  // Navigate to next testimonial
  const next = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
    setAutoplay(false);
  };
  
  // Select a specific testimonial
  const goTo = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-primary text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white opacity-5" style={{ transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5" style={{ transform: 'translate(20%, 20%)' }} />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="max-w-2xl mx-auto">
            Read how SheShape has helped women transform their lives through fitness and wellness.
          </p>
        </div>
        
        <div 
          className="relative max-w-6xl mx-auto px-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Testimonial carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                    {/* Before/After images - on larger screens */}
                    <div className="hidden md:block md:col-span-5">
                      <div className="relative">
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                          <div className="relative aspect-[4/5]">
                            <Image
                              src={testimonial.beforeImage}
                              alt={`${testimonial.name} before`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-3 left-3 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                              BEFORE
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-1/4 left-1/2 w-3/4 rounded-lg overflow-hidden shadow-lg border-4 border-white">
                          <div className="relative aspect-[4/5]">
                            <Image
                              src={testimonial.afterImage}
                              alt={`${testimonial.name} after`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute bottom-3 left-3 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                              AFTER
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial content */}
                    <Card className="md:col-span-7 bg-white/10 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-8">
                        <Quote className="w-10 h-10 text-white/50 mb-4" />
                        <blockquote className="text-xl md:text-2xl italic mb-6 font-light">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={60}
                              height={60}
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-white/80 text-sm">{testimonial.location}</div>
                            <div className="text-white/80 text-sm mt-1">
                              Program: {testimonial.program}
                            </div>
                          </div>
                        </div>
                        
                        {/* Star rating */}
                        <div className="flex mt-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-300' : 'text-white/30'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-0 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-0 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}