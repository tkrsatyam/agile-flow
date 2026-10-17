package com.agileflow.dto;

import com.agileflow.model.enums.SprintState;

import java.time.LocalDate;
import java.util.UUID;

public record SprintResponse(
        UUID id,
        UUID projectId,
        String name,
        String goal,
        SprintState state,
        LocalDate startDate,
        LocalDate endDate,
        int issueCount,
        int totalStoryPoints
) {
}
