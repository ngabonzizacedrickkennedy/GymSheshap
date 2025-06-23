'use client';

import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Utensils, 
  Users, 
  PlayCircle, 
  ShoppingBag, 
  FileText, 
  Heart,
  Zap,
  Target,
  Award
} from 'lucide-react';

const features = [
  {
    icon: Dumbbell,
    title: 'Personalized Workouts',
    description: 'AI-powered workout plans tailored to your fitness level, goals, and preferences.',
    color: 'from-primary to-primary/80',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Utensils,
    title: 'Nutrition Guidance',
    description: 'Expert-designed meal plans and nutrition advice to fuel your fitness journey.',
    color: 'from-secondary to-secondary/80',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Connect with like-minded women, share progress, and motivate each other.',
    color: 'from-accent1 to-accent1/80',
    bgColor: 'bg-accent1/10',
  },
  {
    icon: PlayCircle,
    title: 'HD Video Workouts',
    description: 'High-quality workout videos with professional trainers guiding every move.',
    color: 'from-accent2 to-accent2/80',
    bgColor: 'bg-accent2/10',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Monitor your progress with detailed analytics and achievement milestones.',
    color: 'from-primary to-secondary',
    bgColor: 'bg-gradient-to-r from-primary/10 to-secondary/10',
  },
  {
    icon: Heart,
    title: 'Wellness Focus',
    description: 'Holistic approach to health including mental wellness and self-care.',
    color: 'from-accent1 to-accent2',
    bgColor: 'bg-gradient-to-r from-accent1/10 to-accent2/10',
  },
];

const stats = [
  { number: '50K+', label: 'Active Members', icon: Users },
  { number: '200+', label: 'Workout Programs', icon: Dumbbell },
  { number: '95%', label: 'Success Rate', icon: Award },
  { number: '24/7', label: 'Support Available', icon: Zap },
];

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            SheShape provides all the tools, guidance, and support you need for a successful 
            fitness transformation. Join thousands of women who have already achieved their goals.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                {stat.number}
              </div>
              <div className="text-neutral-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${feature.color}`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300`}>
                    <feature.icon className={`h-8 w-8 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:text-white transition-colors duration-300`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-neutral-600 group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-white to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Ready to Transform Your Life?
            </h3>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join the SheShape community today and start your journey towards a healthier, 
              stronger, and more confident you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Start Free Trial
              </button>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}