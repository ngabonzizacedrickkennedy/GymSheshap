// com.sheshape.service.FileStorageService.java
package com.sheshape.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadFile(MultipartFile file, String directory);
    void deleteFile(String fileKey);
    String getFileUrl(String fileKey);
}