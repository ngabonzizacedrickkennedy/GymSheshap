// sheShape/src/main/java/com/sheshape/dto/FAQDto.java
package com.sheshape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FAQDto {
    private Long id;
    private String question;
    private String answer;
    private String category;
}