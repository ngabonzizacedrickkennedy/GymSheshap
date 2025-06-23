// sheShape/src/main/java/com/sheshape/service/ContactService.java
package com.sheshape.service;

import com.sheshape.dto.ContactFormDto;
import com.sheshape.dto.FAQDto;

import java.util.List;

public interface ContactService {
    
    void processContactForm(ContactFormDto contactForm);
    
    List<FAQDto> getAllFAQs();
    
    List<FAQDto> getFAQsByCategory(String category);
}