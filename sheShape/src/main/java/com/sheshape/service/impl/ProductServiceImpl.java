package com.sheshape.service.impl;

import com.sheshape.dto.ProductDto;
import com.sheshape.dto.ProductImageDto;
import com.sheshape.exception.BadRequestException;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.Product;
import com.sheshape.model.ProductImage;
import com.sheshape.repository.ProductImageRepository;
import com.sheshape.repository.ProductRepository;
import com.sheshape.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ProductServiceImpl(ProductRepository productRepository,ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    @Override
    public Page<ProductDto> getAllActiveProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(ProductDto::new);
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductDto::new);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        return new ProductDto(product);
    }

    @Override
    public Page<ProductDto> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryAndIsActiveTrue(category, pageable)
                .map(ProductDto::new);
    }

    @Override
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable)
                .map(ProductDto::new);
    }

    @Override
    public List<ProductDto> getProductsInStock() {
        return productRepository.findByIsActiveTrueAndInventoryCountGreaterThan(0).stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        // Create the product with basic fields
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setDiscountPrice(productDto.getDiscountPrice());
        product.setInventoryCount(productDto.getInventoryCount());
        product.setIsActive(productDto.getIsActive() != null ? productDto.getIsActive() : true);

        // Add categories
        if (productDto.getCategories() != null && !productDto.getCategories().isEmpty()) {
            product.setCategories(productDto.getCategories());
        }

        // Save the product first to get an ID
        Product savedProduct = productRepository.save(product);

        // Add images if provided
        if (productDto.getImages() != null && !productDto.getImages().isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();

            // Flag to ensure at least one image is main
            boolean hasMainImage = productDto.getImages().stream()
                    .anyMatch(ProductImageDto::isMain);

            // If no image is marked as main, make the first one main
            boolean makeFirstMain = !hasMainImage && !productDto.getImages().isEmpty();

            for (int i = 0; i < productDto.getImages().size(); i++) {
                ProductImageDto imageDto = productDto.getImages().get(i);

                ProductImage image = new ProductImage();
                image.setProduct(savedProduct);
                image.setImageUrl(imageDto.getImageUrl());
                image.setFileKey(imageDto.getFileKey());
                image.setMain(imageDto.isMain() || (makeFirstMain && i == 0));
                image.setPosition(imageDto.getPosition() != null ? imageDto.getPosition() : i);

                productImages.add(image);
            }

            savedProduct.setImages(productImages);
            savedProduct = productRepository.save(savedProduct);
        }

        return convertToDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update basic fields
        if (productDto.getName() != null) {
            product.setName(productDto.getName());
        }

        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }

        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }

        if (productDto.getDiscountPrice() != null) {
            product.setDiscountPrice(productDto.getDiscountPrice());
        }

        if (productDto.getInventoryCount() != null) {
            product.setInventoryCount(productDto.getInventoryCount());
        }

        if (productDto.getIsActive() != null) {
            product.setIsActive(productDto.getIsActive());
        }

        // Update categories
        if (productDto.getCategories() != null) {
            product.setCategories(productDto.getCategories());
        }

        // Handle image updates if provided
        if (productDto.getImages() != null) {
            // First clear existing images if we're setting new ones
            product.getImages().clear();

            // Flag to ensure at least one image is main
            boolean hasMainImage = productDto.getImages().stream()
                    .anyMatch(ProductImageDto::isMain);

            // If no image is marked as main, make the first one main
            boolean makeFirstMain = !hasMainImage && !productDto.getImages().isEmpty();

            for (int i = 0; i < productDto.getImages().size(); i++) {
                ProductImageDto imageDto = productDto.getImages().get(i);

                ProductImage image = new ProductImage();
                if (imageDto.getId() != null) {
                    // This is an existing image
                    image = productImageRepository.findById(imageDto.getId())
                            .orElse(new ProductImage());
                }

                image.setProduct(product);
                image.setImageUrl(imageDto.getImageUrl());
                image.setFileKey(imageDto.getFileKey());
                image.setMain(imageDto.isMain() || (makeFirstMain && i == 0));
                image.setPosition(imageDto.getPosition() != null ? imageDto.getPosition() : i);

                product.getImages().add(image);
            }
        }

        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    @Override
    @Transactional
    public ProductDto activateProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setIsActive(true);
        Product activatedProduct = productRepository.save(product);
        
        return new ProductDto(activatedProduct);
    }

    @Override
    @Transactional
    public ProductDto deactivateProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setIsActive(false);
        Product deactivatedProduct = productRepository.save(product);
        
        return new ProductDto(deactivatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public boolean updateInventory(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        if (product.getInventoryCount() < quantity) {
            return false; // Not enough inventory
        }
        
        product.setInventoryCount(product.getInventoryCount() - quantity);
        productRepository.save(product);
        
        return true;
    }
    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setInventoryCount(product.getInventoryCount());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Convert categories
        dto.setCategories(product.getCategories());

        // Convert images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<ProductImageDto> imageDtos = product.getImages().stream()
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

            dto.setImages(imageDtos);
        }

        return dto;
    }
}