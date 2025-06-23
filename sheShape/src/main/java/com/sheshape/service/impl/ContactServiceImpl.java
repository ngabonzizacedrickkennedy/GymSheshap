// sheShape/src/main/java/com/sheshape/service/impl/ContactServiceImpl.java
package com.sheshape.service.impl;

import com.sheshape.dto.ContactFormDto;
import com.sheshape.dto.FAQDto;
import com.sheshape.model.FAQ;
import com.sheshape.repository.FAQRepository;
import com.sheshape.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    private final JavaMailSender mailSender;
    private final FAQRepository faqRepository;
    private final String supportEmail = "support@sheshape.com";

    public ContactServiceImpl(JavaMailSender mailSender, FAQRepository faqRepository) {
        this.mailSender = mailSender;
        this.faqRepository = faqRepository;
    }

    @Override
    public void processContactForm(ContactFormDto contactForm) {
        // Create and send email notification to admin
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(contactForm.getEmail());
        message.setTo(supportEmail);
        message.setSubject("SheShape Contact Form: " + contactForm.getSubject());
        message.setText(
            "Name: " + contactForm.getName() + "\n" +
            "Email: " + contactForm.getEmail() + "\n\n" +
            "Message: \n" + contactForm.getMessage()
        );

        mailSender.send(message);

        // Create and send confirmation email to the user
        SimpleMailMessage confirmationMessage = new SimpleMailMessage();
        confirmationMessage.setFrom(supportEmail);
        confirmationMessage.setTo(contactForm.getEmail());
        confirmationMessage.setSubject("Thank you for contacting SheShape");
        confirmationMessage.setText(
            "Dear " + contactForm.getName() + ",\n\n" +
            "Thank you for contacting SheShape. We have received your message and will get back to you as soon as possible.\n\n" +
            "Your message: \n" + contactForm.getMessage() + "\n\n" +
            "Best regards,\n" +
            "The SheShape Team"
        );

        mailSender.send(confirmationMessage);

        // Here you might also want to save the contact form to a database
        // for record keeping or further processing
    }

    @Override
    public List<FAQDto> getAllFAQs() {
        return faqRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FAQDto> getFAQsByCategory(String category) {
        return faqRepository.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private FAQDto convertToDto(FAQ faq) {
        FAQDto dto = new FAQDto();
        dto.setId(faq.getId());
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        dto.setCategory(faq.getCategory());
        return dto;
    }
}