package com.sheshape.dto;

import com.sheshape.model.BlogPost;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogPostDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String imageUrl;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private Boolean isPublished;
    
    private LocalDateTime publishedAt;
    
    private Long authorId;
    
    private UserDto author;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor from BlogPost entity
    public BlogPostDto(BlogPost blogPost) {
        this.id = blogPost.getId();
        this.title = blogPost.getTitle();
        this.content = blogPost.getContent();
        this.imageUrl = blogPost.getImageUrl();
        this.category = blogPost.getCategory();
        this.isPublished = blogPost.getIsPublished();
        this.publishedAt = blogPost.getPublishedAt();
        this.authorId = blogPost.getAuthor().getId();
        this.createdAt = blogPost.getCreatedAt();
        this.updatedAt = blogPost.getUpdatedAt();
        
        if (blogPost.getAuthor() != null) {
            this.author = new UserDto(blogPost.getAuthor());
        }
    }
}