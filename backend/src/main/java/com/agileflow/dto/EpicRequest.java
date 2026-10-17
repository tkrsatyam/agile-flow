package com.agileflow.dto;

import com.agileflow.model.enums.EpicStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EpicRequest(
        @NotBlank(message = "Epic title is required")
        @Size(max = 200, message = "Title cannot exceed 200 characters")
        String title,

        @Size(max = 30)
        String color,

        EpicStatus status
) {}
