package com.agileflow.dto;

import com.agileflow.model.enums.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateIssueRequest(
        @NotBlank(message = "Issue title is required")
        @Size(max = 255, message = "Title cannot exceed 255 characters")
        String title,

        String description,

        @NotNull(message = "Issue type is required")
        IssueType issueType,

        UUID epicId,

        UUID sprintId,

        Integer storyPoints
) {}
