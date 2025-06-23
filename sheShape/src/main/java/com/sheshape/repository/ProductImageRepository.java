// com.sheshape.repository.ProductImageRepository.java
package com.sheshape.repository;

import com.sheshape.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    
    /**
     * Find all images for a specific product
     * @param productId The product ID
     * @return List of product images ordered by position
     */
    List<ProductImage> findByProductIdOrderByPositionAsc(Long productId);
    
    /**
     * Find the main image for a product
     * @param productId The product ID
     * @return The main product image or null if none is set as main
     */
    ProductImage findByProductIdAndIsMainTrue(Long productId);
    
    /**
     * Delete all images for a specific product
     * @param productId The product ID
     */
    void deleteByProductId(Long productId);
    
    /**
     * Count how many images a product has
     * @param productId The product ID
     * @return The number of images
     */
    long countByProductId(Long productId);
}