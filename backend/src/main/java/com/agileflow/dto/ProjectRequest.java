package com.agileflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
        @NotBlank(message = "Project key is required")
        @Size(min = 2, max = 10, message = "Project key must be between 2 and 10 characters")
        @Pattern(regexp = "^[A-Z0-9]+$", message = "Project key must contain uppercase letters and numbers only")
        String key,

        @NotBlank(message = "Project name is required")
        @Size(max = 100, message = "Project name cannot exceed 100 characters")
        String name,

        String description
) {}
