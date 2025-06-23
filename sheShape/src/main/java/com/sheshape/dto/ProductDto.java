package com.sheshape.dto;

import com.sheshape.model.Product;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    
    private Long id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;
    
    private BigDecimal discountPrice;
    
    @NotNull(message = "Inventory count is required")
    @Min(value = 0, message = "Inventory count cannot be negative")
    private Integer inventoryCount;

    private Set<String> categories = new HashSet<>();

    // Instead of single imageUrl, use List of images
    private List<ProductImageDto> images = new ArrayList<>();
    
    private Boolean isActive;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    // Constructor from Product entity
    public ProductDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.discountPrice = product.getDiscountPrice();
        this.inventoryCount = product.getInventoryCount();
        this.isActive = product.getIsActive();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();

        // Convert categories
        if (product.getCategories() != null) {
            this.categories = new HashSet<>(product.getCategories());
        }

        // Convert images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            this.images = product.getImages().stream()
                    .map(image -> {
                        ProductImageDto imageDto = new ProductImageDto();
                        imageDto.setId(image.getId());
                        imageDto.setProductId(product.getId());
                        imageDto.setImageUrl(image.getImageUrl());
                        imageDto.setFileKey(image.getFileKey());
                        imageDto.setMain(image.isMain());
                        imageDto.setPosition(image.getPosition());
                        imageDto.setCreatedAt(image.getCreatedAt());
                        return imageDto;
                    })
                    .collect(Collectors.toList());
        }
    }
}