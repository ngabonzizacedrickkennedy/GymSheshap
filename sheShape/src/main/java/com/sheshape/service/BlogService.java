package com.sheshape.service;

import com.sheshape.dto.BlogPostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogService {
    
    Page<BlogPostDto> getAllPublishedPosts(Pageable pageable);
    
    Page<BlogPostDto> getAllPosts(Pageable pageable);
    
    BlogPostDto getPostById(Long id);
    
    List<BlogPostDto> getPostsByAuthor(Long authorId);
    
    Page<BlogPostDto> getPostsByCategory(String category, Pageable pageable);
    
    Page<BlogPostDto> searchPosts(String keyword, Pageable pageable);
    
    BlogPostDto createPost(BlogPostDto blogPostDto);
    
    BlogPostDto updatePost(Long id, BlogPostDto blogPostDto);
    
    BlogPostDto publishPost(Long id);
    
    BlogPostDto unpublishPost(Long id);
    
    void deletePost(Long id);
}