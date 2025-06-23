package com.sheshape.service;

import com.sheshape.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    
    Page<ProductDto> getAllActiveProducts(Pageable pageable);
    
    Page<ProductDto> getAllProducts(Pageable pageable);
    
    ProductDto getProductById(Long id);
    
    Page<ProductDto> getProductsByCategory(String category, Pageable pageable);
    
    Page<ProductDto> searchProducts(String keyword, Pageable pageable);
    
    List<ProductDto> getProductsInStock();
    
    ProductDto createProduct(ProductDto productDto);
    
    ProductDto updateProduct(Long id, ProductDto productDto);
    
    ProductDto activateProduct(Long id);
    
    ProductDto deactivateProduct(Long id);
    
    void deleteProduct(Long id);
    
    boolean updateInventory(Long id, int quantity);
}