// sheShape/src/main/java/com/sheshape/repository/FAQRepository.java
package com.sheshape.repository;

import com.sheshape.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    List<FAQ> findByCategory(String category);
    
    List<FAQ> findByOrderByDisplayOrderAsc();
}