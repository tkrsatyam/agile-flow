package com.agileflow.dto;

import com.agileflow.model.enums.IssueStatus;
import com.agileflow.model.enums.IssueType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record IssueResponse(
        UUID id,
        UUID projectId,
        String projectKey,
        UUID epicId,
        String epicKey,
        String epicTitle,
        String epicColor,
        UUID sprintId,
        String key,
        String title,
        String description,
        IssueType issueType,
        IssueStatus status,
        Integer storyPoints,
        int rank,
        Instant createdAt,
        Instant updatedAt,
        List<SubTaskDto.SubTaskResponse> subtasks
) {}
