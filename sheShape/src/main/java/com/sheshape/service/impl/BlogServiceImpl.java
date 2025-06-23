package com.sheshape.service.impl;

import com.sheshape.dto.BlogPostDto;
import com.sheshape.exception.ResourceNotFoundException;
import com.sheshape.model.BlogPost;
import com.sheshape.model.User;
import com.sheshape.repository.BlogPostRepository;
import com.sheshape.repository.UserRepository;
import com.sheshape.service.BlogService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {

    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    public BlogServiceImpl(BlogPostRepository blogPostRepository, UserRepository userRepository) {
        this.blogPostRepository = blogPostRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Page<BlogPostDto> getAllPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByIsPublishedTrue(pageable)
                .map(BlogPostDto::new);
    }

    @Override
    public Page<BlogPostDto> getAllPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable)
                .map(BlogPostDto::new);
    }

    @Override
    public BlogPostDto getPostById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        // If post is not published, only author or admin can see it
        if (!post.getIsPublished()) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(authentication.getName())
                    .orElse(null);

            if (currentUser == null ||
                    (!post.getAuthor().getId().equals(currentUser.getId()) &&
                            currentUser.getRole() != User.Role.ADMIN)) {
                throw new AccessDeniedException("You do not have permission to view this post");
            }
        }

        return new BlogPostDto(post);
    }

    @Override
    public List<BlogPostDto> getPostsByAuthor(Long authorId) {
        return blogPostRepository.findByAuthorId(authorId).stream()
                .map(BlogPostDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BlogPostDto> getPostsByCategory(String category, Pageable pageable) {
        return blogPostRepository.findByCategoryAndIsPublishedTrue(category, pageable)
                .map(BlogPostDto::new);
    }

    @Override
    public Page<BlogPostDto> searchPosts(String keyword, Pageable pageable) {
        return blogPostRepository.findByTitleContainingIgnoreCaseAndIsPublishedTrue(keyword, pageable)
                .map(BlogPostDto::new);
    }

    @Override
    @Transactional
    public BlogPostDto createPost(BlogPostDto blogPostDto) {
        // Get current user as author
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User author = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is an admin, trainer, or nutritionist
        if (author.getRole() != User.Role.ADMIN &&
                author.getRole() != User.Role.TRAINER &&
                author.getRole() != User.Role.NUTRITIONIST) {
            throw new AccessDeniedException("You do not have permission to create blog posts");
        }

        // Create blog post
        BlogPost post = new BlogPost();
        post.setTitle(blogPostDto.getTitle());
        post.setContent(blogPostDto.getContent());
        post.setImageUrl(blogPostDto.getImageUrl());
        post.setCategory(blogPostDto.getCategory());
        post.setIsPublished(blogPostDto.getIsPublished() != null ? blogPostDto.getIsPublished() : false);
        post.setAuthor(author);

        if (Boolean.TRUE.equals(post.getIsPublished())) {
            post.setPublishedAt(LocalDateTime.now());
        }

        BlogPost savedPost = blogPostRepository.save(post);

        return new BlogPostDto(savedPost);
    }

    @Override
    @Transactional
    public BlogPostDto updatePost(Long id, BlogPostDto blogPostDto) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the author or an admin
        if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You do not have permission to update this post");
        }

        // Update post
        if (blogPostDto.getTitle() != null) {
            post.setTitle(blogPostDto.getTitle());
        }

        if (blogPostDto.getContent() != null) {
            post.setContent(blogPostDto.getContent());
        }

        if (blogPostDto.getImageUrl() != null) {
            post.setImageUrl(blogPostDto.getImageUrl());
        }

        if (blogPostDto.getCategory() != null) {
            post.setCategory(blogPostDto.getCategory());
        }

        if (blogPostDto.getIsPublished() != null) {
            boolean wasPublished = post.getIsPublished();
            post.setIsPublished(blogPostDto.getIsPublished());

            // If publishing for the first time, set published date
            if (!wasPublished && blogPostDto.getIsPublished()) {
                post.setPublishedAt(LocalDateTime.now());
            }
        }

        BlogPost updatedPost = blogPostRepository.save(post);

        return new BlogPostDto(updatedPost);
    }

    @Override
    @Transactional
    public BlogPostDto publishPost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the author or an admin
        if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You do not have permission to publish this post");
        }

        post.setIsPublished(true);
        post.setPublishedAt(LocalDateTime.now());

        BlogPost publishedPost = blogPostRepository.save(post);

        return new BlogPostDto(publishedPost);
    }

    @Override
    @Transactional
    public BlogPostDto unpublishPost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the author or an admin
        if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You do not have permission to unpublish this post");
        }

        post.setIsPublished(false);

        BlogPost unpublishedPost = blogPostRepository.save(post);

        return new BlogPostDto(unpublishedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Ensure the user is the author or an admin
        if (!post.getAuthor().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You do not have permission to delete this post");
        }

        blogPostRepository.delete(post);
    }
}