'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const navigation = {
  programs: [
    { name: 'All Programs', href: '/programs' },
    { name: 'Strength Training', href: '/programs?category=strength' },
    { name: 'HIIT Workouts', href: '/programs?category=hiit' },
    { name: 'Yoga & Flexibility', href: '/programs?category=yoga' },
    { name: 'Cardio', href: '/programs?category=cardio' },
  ],
  nutrition: [
    { name: 'All Plans', href: '/nutrition' },
    { name: 'Weight Loss', href: '/nutrition?category=weight-loss' },
    { name: 'Muscle Building', href: '/nutrition?category=muscle-building' },
    { name: 'Vegan', href: '/nutrition?category=vegan' },
    { name: 'Meal Planning', href: '/nutrition?category=meal-planning' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refunds' },
    { name: 'FAQ', href: '/faq' },
  ],
  social: [
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'YouTube',
      href: '#',
      icon: Youtube,
    },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription
    toast.success(`Thanks for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <footer className="bg-neutral-50 border-t">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="SheShape Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-cursive text-2xl text-primary">SheShape</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-600 max-w-xs">
              Empowering women through fitness, nutrition, and wellness. Join our
              community and transform your life.
            </p>
            
            {/* Newsletter signup */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-900">
                Subscribe to our newsletter
              </h3>
              <form 
                className="mt-2 flex gap-2" 
                onSubmit={handleSubscribe}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="icon">
                  <Send size={16} />
                </Button>
              </form>
            </div>
            
            {/* Social links */}
            <div className="mt-6 flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-neutral-500 hover:text-primary"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation columns */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Programs</h3>
            <ul className="mt-4 space-y-2">
              {navigation.programs.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Nutrition</h3>
            <ul className="mt-4 space-y-2">
              {navigation.nutrition.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Support</h3>
            <ul className="mt-4 space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-xs text-center text-neutral-500">
            &copy; {new Date().getFullYear()} SheShape. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}