// com.sheshape.service.impl.ProductImageServiceImpl.java
package com.sheshape.service.impl;

import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.Product;
import com.sheshape.model.ProductImage;
import com.sheshape.repository.ProductImageRepository;
import com.sheshape.repository.ProductRepository;
import com.sheshape.service.ProductImageService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    
    public ProductImageServiceImpl(
            ProductImageRepository productImageRepository,
            ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductImage> getProductImages(Long productId) {
        return productImageRepository.findByProductIdOrderByPositionAsc(productId);
    }

    @Override
    public ProductImage getProductImageById(Long imageId) {
        return productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + imageId));
    }

    @Override
    public ProductImage getMainImage(Long productId) {
        return productImageRepository.findByProductIdAndIsMainTrue(productId);
    }

    @Override
    @Transactional
    public ProductImage addProductImage(Long productId, String imageUrl, String fileKey, boolean isMain) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        // If this is set as main, reset all other main images
        if (isMain) {
            resetMainImages(productId);
        }
        
        // Determine position (add at the end)
        int position = (int) productImageRepository.countByProductId(productId);
        
        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(imageUrl);
        image.setFileKey(fileKey);
        image.setMain(isMain);
        image.setPosition(position);
        
        return productImageRepository.save(image);
    }

    @Override
    @Transactional
    public ProductImage updateProductImage(Long imageId, boolean isMain, Integer position) {
        ProductImage image = getProductImageById(imageId);
        
        // If this is set as main, reset all other main images
        if (isMain && !image.isMain()) {
            resetMainImages(image.getProduct().getId());
        }
        
        image.setMain(isMain);
        if (position != null) {
            image.setPosition(position);
        }
        
        return productImageRepository.save(image);
    }

    @Override
    @Transactional
    public void deleteProductImage(Long imageId) {
        ProductImage image = getProductImageById(imageId);
        
        // If this was the main image, pick another one as main (if any exists)
        if (image.isMain()) {
            List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(
                    image.getProduct().getId());
            
            // Find another image to set as main (first one that's not the current image)
            images.stream()
                    .filter(img -> !img.getId().equals(imageId))
                    .findFirst()
                    .ifPresent(newMain -> {
                        newMain.setMain(true);
                        productImageRepository.save(newMain);
                    });
        }
        
        productImageRepository.deleteById(imageId);
    }

    @Override
    @Transactional
    public ProductImage setMainImage(Long imageId) {
        ProductImage image = getProductImageById(imageId);
        
        // Reset all main images for this product
        resetMainImages(image.getProduct().getId());
        
        // Set this image as main
        image.setMain(true);
        return productImageRepository.save(image);
    }

    @Override
    @Transactional
    public void updateImagePositions(List<ProductImage> updatedImages) {
        for (ProductImage image : updatedImages) {
            ProductImage existingImage = productImageRepository.findById(image.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + image.getId()));
            
            existingImage.setPosition(image.getPosition());
            if (image.isMain() && !existingImage.isMain()) {
                // Reset main images if this one is becoming main
                resetMainImages(existingImage.getProduct().getId());
                existingImage.setMain(true);
            } else if (!image.isMain() && existingImage.isMain()) {
                // If we're unsetting the main, ensure another image becomes main
                List<ProductImage> otherImages = productImageRepository.findByProductIdOrderByPositionAsc(
                        existingImage.getProduct().getId());
                ProductImage newMain = otherImages.stream()
                        .filter(img -> !img.getId().equals(existingImage.getId()))
                        .findFirst()
                        .orElse(null);
                
                if (newMain != null) {
                    newMain.setMain(true);
                    productImageRepository.save(newMain);
                } else {
                    // If no other images, keep this one as main
                    continue;
                }
            }
            
            productImageRepository.save(existingImage);
        }
    }

    @Override
    @Transactional
    public void deleteAllProductImages(Long productId) {
        productImageRepository.deleteByProductId(productId);
    }
    
    /**
     * Helper method to reset all main images for a product
     */
    private void resetMainImages(Long productId) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(productId);
        for (ProductImage img : images) {
            if (img.isMain()) {
                img.setMain(false);
                productImageRepository.save(img);
            }
        }
    }
}