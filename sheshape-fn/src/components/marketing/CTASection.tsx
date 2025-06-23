'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const benefits = [
  'Personalized workout programs',
  'Expert nutrition guidance',
  'Supportive community of women',
  'Access to certified trainers',
  'Progress tracking and analytics',
  'Exclusive content and resources',
];

export function CTASection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cta-background.jpg"
          alt="Women exercising together"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 mix-blend-multiply" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side text content */}
          <div className="text-white">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Start Your Fitness Journey Today
            </motion.h2>
            
            <motion.p 
              className="text-white/90 text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of women who have transformed their lives with SheShape's comprehensive fitness and wellness platform.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-accent1 mr-2 flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.div 
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                <Link href="/register">
                  Join Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                <Link href="/programs">
                  Explore Programs
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Right side pricing card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-primary-50 p-6 text-center border-b border-primary-100">
              <h3 className="text-2xl font-bold text-primary mb-1">Get Started Today</h3>
              <p className="text-neutral-600">Choose the plan that fits your goals</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Monthly plan */}
              <div className="border border-primary/20 rounded-xl p-5 bg-white hover:border-primary hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">Monthly Plan</h4>
                    <p className="text-sm text-neutral-500">Perfect for trying out</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">$19</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Access to all workout programs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Basic nutrition guidance</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Community forum access</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full">
                  <Link href="/register?plan=monthly">
                    Get Started
                  </Link>
                </Button>
              </div>
              
              {/* Yearly plan - featured */}
              <div className="border-2 border-primary rounded-xl p-5 bg-white relative shadow-md">
                <div className="absolute -top-3 right-5 bg-accent1 text-white text-xs px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">Annual Plan</h4>
                    <p className="text-sm text-neutral-500">Save 33% with yearly billing</p>
                  </div>
                  <div className="text-right">
                    <div>
                      <span className="text-3xl font-bold text-primary">$149</span>
                      <span className="text-neutral-500">/year</span>
                    </div>
                    <div className="text-sm text-neutral-500 line-through">$228</div>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Everything in Monthly Plan</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Advanced nutrition plans</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Personal trainer consultation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Exclusive premium content</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full">
                  <Link href="/register?plan=annual">
                    Choose Annual Plan
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs text-center text-neutral-500">
                30-day money-back guarantee. No commitment required.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}