package com.agileflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class SubTaskDto {

    public record SubTaskRequest(
            @NotBlank(message = "Subtask title is required")
            @Size(max = 255)
            String title,
            boolean isCompleted,
            int orderIndex
    ) {}

    public record SubTaskResponse(
            UUID id,
            String title,
            boolean isCompleted,
            int orderIndex
    ) {}
}
