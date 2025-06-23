package com.sheshape.repository;

import com.sheshape.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    // Updated method to find products by category using @Query
    @Query("SELECT DISTINCT p FROM Product p JOIN p.categories c WHERE c = :category AND p.isActive = true")
    Page<Product> findByCategoryAndIsActiveTrue(@Param("category") String category, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String keyword, Pageable pageable);

    // Updated method to include category check in query
    @Query("SELECT p FROM Product p JOIN p.categories c WHERE p.isActive = true AND p.inventoryCount > :minInventory GROUP BY p")
    List<Product> findByIsActiveTrueAndInventoryCountGreaterThan(int minInventory);
}