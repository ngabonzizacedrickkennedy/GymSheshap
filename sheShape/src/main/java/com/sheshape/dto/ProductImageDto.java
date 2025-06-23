// com.sheshape.dto.ProductImageDto.java
package com.sheshape.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageDto {
    
    private Long id;
    
    private Long productId;
    
    private String imageUrl;
    
    private String fileKey;
    
    @JsonProperty("isMain")
    private boolean main;
    
    private Integer position;
    
    private LocalDateTime createdAt;
}