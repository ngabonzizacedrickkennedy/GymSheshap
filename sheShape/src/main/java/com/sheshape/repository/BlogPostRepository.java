package com.sheshape.repository;

import com.sheshape.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    Page<BlogPost> findByIsPublishedTrue(Pageable pageable);
    
    List<BlogPost> findByAuthorId(Long authorId);
    
    List<BlogPost> findByAuthorIdAndIsPublishedTrue(Long authorId);
    
    Page<BlogPost> findByCategoryAndIsPublishedTrue(String category, Pageable pageable);
    
    Page<BlogPost> findByTitleContainingIgnoreCaseAndIsPublishedTrue(String keyword, Pageable pageable);
}