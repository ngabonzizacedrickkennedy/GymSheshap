package com.sheshape.controller;

import com.sheshape.dto.BlogPostDto;
import com.sheshape.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<BlogPostDto>> getAllPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(blogService.getAllPublishedPosts(pageable));
    }
    
    @GetMapping("/posts/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BlogPostDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(blogService.getAllPosts(pageable));
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<BlogPostDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }
    
    @GetMapping("/author/{authorId}/posts")
    public ResponseEntity<List<BlogPostDto>> getPostsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(blogService.getPostsByAuthor(authorId));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<BlogPostDto>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(blogService.getPostsByCategory(category, pageable));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<BlogPostDto>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(blogService.searchPosts(keyword, pageable));
    }
    
    @PostMapping("/posts")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<BlogPostDto> createPost(@Valid @RequestBody BlogPostDto blogPostDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.createPost(blogPostDto));
    }
    
    @PutMapping("/posts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<BlogPostDto> updatePost(
            @PathVariable Long id, 
            @Valid @RequestBody BlogPostDto blogPostDto) {
        return ResponseEntity.ok(blogService.updatePost(id, blogPostDto));
    }
    
    @PutMapping("/posts/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<BlogPostDto> publishPost(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.publishPost(id));
    }
    
    @PutMapping("/posts/{id}/unpublish")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<BlogPostDto> unpublishPost(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.unpublishPost(id));
    }
    
    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'NUTRITIONIST')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}