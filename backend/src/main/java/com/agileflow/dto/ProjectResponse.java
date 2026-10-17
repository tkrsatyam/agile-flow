package com.agileflow.dto;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String key,
        String name,
        String description,
        Instant createdAt
) {}
