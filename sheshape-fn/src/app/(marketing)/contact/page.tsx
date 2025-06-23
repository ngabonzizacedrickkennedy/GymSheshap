// src/app/(marketing)/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { contactService } from '@/services/contactService';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form schema using zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// Static FAQs as fallback
const staticFaqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes SheShape different from other fitness platforms?",
    answer: "SheShape is specifically designed for women, with programs and nutrition plans that account for women's unique physiological needs, hormonal cycles, and fitness goals. Our platform provides a supportive community and expert guidance from trainers and nutritionists who specialize in women's health and fitness."
  },
  {
    id: 2,
    question: "Do I need any special equipment for the workout programs?",
    answer: "Many of our programs are designed to be done with minimal equipment. Basic programs typically require just a yoga mat and perhaps some light dumbbells or resistance bands. More advanced programs might suggest additional equipment, but we always offer modifications for those with limited access to equipment."
  },
  {
    id: 3,
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time through your account settings. Your access will continue until the end of your current billing period, after which it will not renew."
  },
  {
    id: 4,
    question: "Are the nutrition plans suitable for vegetarians/vegans?",
    answer: "Absolutely! We offer various nutrition plans to accommodate different dietary preferences and restrictions, including vegetarian, vegan, gluten-free, and dairy-free options. You can filter and select plans that match your specific dietary needs."
  },
  {
    id: 5,
    question: "How personalized are the programs?",
    answer: "Our programs adapt to your fitness level, goals, and preferences. During the initial setup, you'll complete a comprehensive assessment that helps us recommend the most suitable programs for you. As you progress and provide feedback, your recommendations will be further refined to ensure optimal results."
  },
  {
    id: 6,
    question: "Is there a mobile app available?",
    answer: "Yes, SheShape is accessible via our mobile-responsive website and dedicated mobile apps for iOS and Android. You can track your workouts, follow nutrition plans, and connect with the community on any device."
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(staticFaqs);
  const [faqsLoading, setFaqsLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  // Fetch FAQs from backend
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setFaqsLoading(true);
        const faqsData = await contactService.getFAQs();
        
        // Only use API data if it's valid and non-empty
        if (faqsData && Array.isArray(faqsData) && faqsData.length > 0) {
          setFaqs(faqsData);
        }
      } catch (error) {
        console.error('Error loading FAQs:', error);
        // Fallback to static FAQs is already handled by default state
      } finally {
        setFaqsLoading(false);
      }
    };
    
    loadFAQs();
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Use the contact service to submit the form
      await contactService.submitContactForm(data);
      
      // Show success state and reset form
      setIsSuccess(true);
      toast.success('Your message has been sent successfully!');
      reset();
      
      // Reset success state after a delay
      setTimeout(() => setIsSuccess(false), 8000);
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Contact Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Get In Touch</h1>
            <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed">
              Have questions about SheShape? We're here to help you on your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="mb-8">Contact Information</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Email</h3>
                    <p className="text-neutral-600 mb-1">General Inquiries:</p>
                    <a href="mailto:info@sheshape.com" className="text-primary hover:underline">
                      info@sheshape.com
                    </a>
                    <p className="text-neutral-600 mb-1 mt-3">Support:</p>
                    <a href="mailto:support@sheshape.com" className="text-primary hover:underline">
                      support@sheshape.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Phone</h3>
                    <p className="text-neutral-600 mb-1">Customer Service:</p>
                    <a href="tel:+1-800-123-4567" className="text-primary hover:underline">
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Location</h3>
                    <p className="text-neutral-600">
                      SheShape Headquarters<br />
                      123 Fitness Avenue<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Hours</h3>
                    <p className="text-neutral-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                      Saturday: 10:00 AM - 4:00 PM (PST)<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div>
                <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/sheshape" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://facebook.com/sheshape" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com/sheshape" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://youtube.com/sheshape" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
              <h2 className="mb-6">Send Us a Message</h2>
              
              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              
              {isSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700">
                    Your message has been received. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={5}
                      {...register('message')}
                      className={errors.message ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container-custom">
          <div className="rounded-xl overflow-hidden shadow-md border border-neutral-100">
            <div className="relative h-96 w-full">
              <Image
                src="/images/contact/map.jpg"
                alt="SheShape office location map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="font-medium">SheShape Headquarters</p>
                  <p className="text-sm text-neutral-600">123 Fitness Avenue, San Francisco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-10">Frequently Asked Questions</h2>
            
            {faqsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                    <AccordionTrigger className="text-left text-lg font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            
            <div className="mt-10 text-center">
              <p className="text-neutral-600 mb-4">
                Didn't find what you're looking for?
              </p>
              <Button asChild>
                <Link href="/help">
                  Visit Our Help Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}