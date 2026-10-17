package com.agileflow.dto;

import com.agileflow.model.enums.EpicStatus;

import java.util.UUID;

public record EpicResponse(
        UUID id,
        UUID projectId,
        String key,
        String title,
        String color,
        EpicStatus status,
        int issueCount
) {}
