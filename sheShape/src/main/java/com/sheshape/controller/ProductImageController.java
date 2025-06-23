// com.sheshape.controller.ProductImageController.java
package com.sheshape.controller;

import com.sheshape.dto.ProductImageDto;
import com.sheshape.model.ProductImage;
import com.sheshape.service.FileStorageService;
import com.sheshape.service.ProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class ProductImageController {

    private final ProductImageService productImageService;
    private final FileStorageService fileStorageService;
    private static final String PRODUCT_IMAGES_DIRECTORY = "product-images/";

    public ProductImageController(
            ProductImageService productImageService,
            FileStorageService fileStorageService) {
        this.productImageService = productImageService;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Get all images for a product
     */
    @GetMapping("/{productId}/images")
    public ResponseEntity<List<ProductImageDto>> getProductImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageService.getProductImages(productId);
        List<ProductImageDto> imageDtos = images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(imageDtos);
    }

    /**
     * Add a new image to a product
     */
    @PostMapping("/{productId}/images")
    public ResponseEntity<ProductImageDto> addProductImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "isMain", defaultValue = "false") boolean isMain) {
        
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        
        // Upload file to S3
        String fileKey = fileStorageService.uploadFile(file, PRODUCT_IMAGES_DIRECTORY);
        
        // Get the file URL
        String imageUrl = fileStorageService.getFileUrl(fileKey);
        
        // Add image to product
        ProductImage productImage = productImageService.addProductImage(productId, imageUrl, fileKey, isMain);
        
        return ResponseEntity.ok(convertToDto(productImage));
    }

    /**
     * Update image properties
     */
    @PutMapping("/images/{imageId}")
    public ResponseEntity<ProductImageDto> updateProductImage(
            @PathVariable Long imageId,
            @RequestBody ProductImageDto imageDto) {
        
        ProductImage updatedImage = productImageService.updateProductImage(
                imageId, 
                imageDto.isMain(), 
                imageDto.getPosition());
        
        return ResponseEntity.ok(convertToDto(updatedImage));
    }

    /**
     * Set an image as the main image
     */
    @PutMapping("/images/{imageId}/main")
    public ResponseEntity<ProductImageDto> setMainImage(@PathVariable Long imageId) {
        ProductImage mainImage = productImageService.setMainImage(imageId);
        return ResponseEntity.ok(convertToDto(mainImage));
    }

    /**
     * Update the order of images
     */
    @PutMapping("/{productId}/images/reorder")
    public ResponseEntity<Map<String, String>> reorderImages(
            @PathVariable Long productId,
            @RequestBody List<ProductImageDto> images) {
        
        List<ProductImage> productImages = images.stream()
                .map(dto -> {
                    ProductImage image = new ProductImage();
                    image.setId(dto.getId());
                    image.setPosition(dto.getPosition());
                    image.setMain(dto.isMain());
                    return image;
                })
                .collect(Collectors.toList());
        
        productImageService.updateImagePositions(productImages);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image order updated successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an image
     */
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long imageId) {
        productImageService.deleteProductImage(imageId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Convert entity to DTO
     */
    private ProductImageDto convertToDto(ProductImage image) {
        ProductImageDto dto = new ProductImageDto();
        dto.setId(image.getId());
        dto.setProductId(image.getProduct().getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setFileKey(image.getFileKey());
        dto.setMain(image.isMain());
        dto.setPosition(image.getPosition());
        dto.setCreatedAt(image.getCreatedAt());
        return dto;
    }
}