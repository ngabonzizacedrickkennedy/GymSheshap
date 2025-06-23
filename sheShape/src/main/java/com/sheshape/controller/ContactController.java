// sheShape/src/main/java/com/sheshape/controller/ContactController.java
package com.sheshape.controller;

import com.sheshape.dto.ContactFormDto;
import com.sheshape.dto.FAQDto;
import com.sheshape.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ContactController {

   private final ContactService contactService;

   public ContactController(ContactService contactService) {
       this.contactService = contactService;
   }

   @PostMapping("/contact")
   public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactFormDto contactForm) {
       contactService.processContactForm(contactForm);
       return ResponseEntity.ok("Contact form submitted successfully");
   }

   @GetMapping("/faqs")
   public ResponseEntity<List<FAQDto>> getFAQs() {
       List<FAQDto> faqs = contactService.getAllFAQs();
       return ResponseEntity.ok(faqs);
   }
}