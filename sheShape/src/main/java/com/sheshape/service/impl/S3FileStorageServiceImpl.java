// com.sheshape.service.impl.S3FileStorageServiceImpl.java
package com.sheshape.service.impl;

import com.sheshape.exception.BadRequestException;
import com.sheshape.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3FileStorageServiceImpl implements FileStorageService {

    private final S3Client s3Client;
    
    @Value("${aws.s3.bucket}")
    private String bucketName;
    
    @Value("${aws.s3.endpoint}")
    private String s3Endpoint;
    
    public S3FileStorageServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(MultipartFile file, String directory) {
        try {
            // Generate unique file key
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String fileKey = directory + UUID.randomUUID().toString() + extension;
            
            // Upload to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .contentType(file.getContentType())
                    .build();
            
            s3Client.putObject(putObjectRequest, 
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            return fileKey;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to upload file to S3", ex);
        }
    }

    @Override
    public void deleteFile(String fileKey) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();
        
        s3Client.deleteObject(deleteObjectRequest);
    }

    @Override
    public String getFileUrl(String fileKey) {
        // Construct S3 URL
        return "https://"  + bucketName + "." + s3Endpoint + "/" + fileKey;
    }
}