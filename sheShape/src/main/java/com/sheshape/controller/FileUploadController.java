// com.sheshape.controller.FileUploadController.java
package com.sheshape.controller;

import com.sheshape.exception.BadRequestException;
import com.sheshape.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    private static final String BLOG_IMAGES_DIRECTORY = "blog-images/";
    private static final String PRODUCT_IMAGES_DIRECTORY = "product-images/";

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/blog-image")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<Map<String, String>> uploadBlogImage(@RequestParam("image") MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        // Upload file to S3
        String fileKey = fileStorageService.uploadFile(file, BLOG_IMAGES_DIRECTORY);

        // Get the file URL
        String imageUrl = fileStorageService.getFileUrl(fileKey);

        // Return response
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        response.put("fileKey", fileKey);
        response.put("message", "Image uploaded successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/product-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("image") MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        // Upload file to S3
        String fileKey = fileStorageService.uploadFile(file, PRODUCT_IMAGES_DIRECTORY);

        // Get the file URL
        String imageUrl = fileStorageService.getFileUrl(fileKey);

        // Return response
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        response.put("fileKey", fileKey);
        response.put("message", "Product image uploaded successfully");

        return ResponseEntity.ok(response);
    }
}