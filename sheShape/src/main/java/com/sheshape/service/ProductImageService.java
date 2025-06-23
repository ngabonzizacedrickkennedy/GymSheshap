// com.sheshape.service.ProductImageService.java
package com.sheshape.service;

import com.sheshape.model.ProductImage;
import java.util.List;

public interface ProductImageService {
    
    /**
     * Get all images for a product
     * @param productId The product ID
     * @return List of product images ordered by position
     */
    List<ProductImage> getProductImages(Long productId);
    
    /**
     * Get a specific product image by ID
     * @param imageId The image ID
     * @return The product image
     */
    ProductImage getProductImageById(Long imageId);
    
    /**
     * Get the main image for a product
     * @param productId The product ID
     * @return The main product image or null if none is set as main
     */
    ProductImage getMainImage(Long productId);
    
    /**
     * Add a new image to a product
     * @param productId The product ID
     * @param imageUrl The image URL
     * @param fileKey The file key in storage
     * @param isMain Whether this is the main image
     * @return The saved product image
     */
    ProductImage addProductImage(Long productId, String imageUrl, String fileKey, boolean isMain);
    
    /**
     * Update a product image
     * @param imageId The image ID
     * @param isMain Whether this is the main image
     * @param position The display position
     * @return The updated product image
     */
    ProductImage updateProductImage(Long imageId, boolean isMain, Integer position);
    
    /**
     * Delete a product image
     * @param imageId The image ID
     */
    void deleteProductImage(Long imageId);
    
    /**
     * Set a specific image as the main image for a product
     * @param imageId The image ID to set as main
     * @return The updated product image
     */
    ProductImage setMainImage(Long imageId);
    
    /**
     * Update the positions of multiple product images
     * @param updatedImages Map of image IDs to their new positions
     */
    void updateImagePositions(List<ProductImage> updatedImages);
    
    /**
     * Delete all images for a product
     * @param productId The product ID
     */
    void deleteAllProductImages(Long productId);
}