package com.agileflow.dto;

import com.agileflow.model.enums.SprintState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record SprintRequest(
        @NotBlank @Size(max = 100) String name,
        String goal,
        SprintState state,
        LocalDate startDate,
        LocalDate endDate
) {
}
