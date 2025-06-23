package com.sheshape.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import lombok.*;

@Entity
@Table(name = "authorities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Authority {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "authorities")
    private Set<User> users = new HashSet<>();
    
    // Constructor with only the name
    public Authority(String name) {
        this.name = name;
    }
}