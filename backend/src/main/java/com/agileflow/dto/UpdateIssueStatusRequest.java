package com.agileflow.dto;

import com.agileflow.model.enums.IssueStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateIssueStatusRequest(
        @NotNull(message = "Status is required")
        IssueStatus status,

        Integer rank
) {}
