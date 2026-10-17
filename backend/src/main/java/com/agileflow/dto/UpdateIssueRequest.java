package com.agileflow.dto;

import com.agileflow.model.enums.IssueStatus;
import com.agileflow.model.enums.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateIssueRequest(
        @NotBlank(message = "Issue title is required")
        @Size(max = 255)
        String title,

        String description,

        @NotNull
        IssueType issueType,

        @NotNull
        IssueStatus status,

        UUID epicId,

        UUID sprintId,

        Integer storyPoints,

        Integer rank
) {}
