// src/app/(marketing)/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  Award, 
  ArrowRight,
  Target,
  Smile
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Our Mission</h1>
            <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8">
              At SheShape, we're dedicated to empowering women through fitness, nutrition, and community support. We believe every woman deserves to feel strong, confident, and healthy in her body.
            </p>
            <Button size="lg" asChild>
              <Link href="/programs">
                Discover Our Programs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6">Our Story</h2>
              <p className="text-neutral-600 mb-4">
                SheShape was founded in 2020 by fitness trainer Sarah Johnson and nutritionist Emma Chen, who recognized a significant gap in the fitness industry: programs designed specifically for women's unique physiological needs and goals.
              </p>
              <p className="text-neutral-600 mb-4">
                Having worked with hundreds of female clients, they understood that women often face different challenges when it comes to fitness and nutrition—from hormonal fluctuations to societal pressures and busy schedules balancing careers and family responsibilities.
              </p>
              <p className="text-neutral-600 mb-4">
                What began as a small online community has grown into a comprehensive platform serving thousands of women worldwide, offering personalized workout programs, nutrition plans, and a supportive community where every woman can thrive.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/about/our-story.jpg" 
                  alt="SheShape founders" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-neutral-100">
                <p className="text-primary font-bold text-lg">Founded in 2020</p>
                <p className="text-neutral-600">By women, for women</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Our Values</h2>
            <p className="text-lg text-neutral-600">
              These core principles guide everything we do at SheShape
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Inclusivity</h3>
              <p className="text-neutral-600">
                We welcome women of all ages, sizes, backgrounds, and fitness levels. Our platform is designed to meet you where you are on your fitness journey.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Science-Based Approach</h3>
              <p className="text-neutral-600">
                Our programs are backed by research and created by certified professionals who understand women's physiology and nutritional needs.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Personalization</h3>
              <p className="text-neutral-600">
                We believe that no two women are the same, which is why we focus on customizable programs that adapt to individual goals and needs.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Community</h3>
              <p className="text-neutral-600">
                Fitness is better together. We foster a supportive network where women can share experiences, challenges, and victories.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Wellbeing First</h3>
              <p className="text-neutral-600">
                We prioritize overall wellbeing over aesthetic goals, promoting a balanced approach to physical and mental health.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-accent1-100 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-accent1" />
              </div>
              <h3 className="text-xl mb-3">Empowerment</h3>
              <p className="text-neutral-600">
                Our ultimate goal is to empower women to take control of their health and fitness, building confidence that extends to all areas of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Our Team</h2>
            <p className="text-lg text-neutral-600">
              Meet the experts behind SheShape's transformative programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Founder 1 */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden">
                <Image 
                  src="/images/trainers/trainer-1.jpg" 
                  alt="Sarah Johnson" 
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl mb-1">Sarah Johnson</h3>
              <p className="text-primary font-medium mb-3">Co-Founder & Head Trainer</p>
              <p className="text-neutral-600 max-w-sm mx-auto">
                Certified personal trainer with 10+ years of experience specializing in women's fitness and strength training.
              </p>
            </div>
            
            {/* Founder 2 */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden">
                <Image 
                  src="/images/trainers/trainer-2.jpg" 
                  alt="Emma Chen" 
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl mb-1">Emma Chen</h3>
              <p className="text-primary font-medium mb-3">Co-Founder & Head Nutritionist</p>
              <p className="text-neutral-600 max-w-sm mx-auto">
                Registered dietitian with a specialization in women's nutritional needs and holistic wellness approaches.
              </p>
            </div>
            
            {/* Team Member */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden">
                <Image 
                  src="/images/trainers/trainer-3.jpg" 
                  alt="Maya Rodriguez" 
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl mb-1">Maya Rodriguez</h3>
              <p className="text-primary font-medium mb-3">Yoga & Mindfulness Coach</p>
              <p className="text-neutral-600 max-w-sm mx-auto">
                Certified yoga instructor with a background in meditation and stress management techniques.
              </p>
            </div>
          </div>
          
          {/* View all trainers button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/trainers">
                View All Trainers & Nutritionists
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Join Our Community</h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of a supportive network of women committed to health, fitness, and empowerment. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}