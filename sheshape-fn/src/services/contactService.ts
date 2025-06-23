// src/services/contactService.ts
import { api } from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  // Submit contact form
  async submitContactForm(data: ContactFormData): Promise<void> {
    await api.post('/api/contact', data);
  },
  
  // Get FAQ items 
  async getFAQs(): Promise<any[]> {
    const response = await api.get('/api/faqs');
    return response.data;
  }
};