package com.sheshape.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private String imageUrl;
    
    @Column(nullable = false)
    private String fileKey;
    
    @Column(name = "is_main", nullable = false)
    private boolean isMain = false;
    
    @Column(nullable = false)
    private Integer position = 0;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Getters and setters...
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}