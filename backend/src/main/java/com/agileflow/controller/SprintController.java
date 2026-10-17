package com.agileflow.controller;

import com.agileflow.dto.SprintRequest;
import com.agileflow.dto.SprintResponse;
import com.agileflow.service.SprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Sprints", description = "Sprint lifecycle and iteration management")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @GetMapping("/projects/{projectId}/sprints")
    @Operation(summary = "List all sprints for a project")
    public ResponseEntity<List<SprintResponse>> getSprintsByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(sprintService.getSprintsByProject(projectId));
    }

    @GetMapping("/projects/{projectId}/sprints/active")
    @Operation(summary = "Get the active sprint for a project")
    public ResponseEntity<SprintResponse> getActiveSprint(@PathVariable UUID projectId) {
        SprintResponse active = sprintService.getActiveSprint(projectId);
        if (active == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(active);
    }

    @PostMapping("/projects/{projectId}/sprints")
    @Operation(summary = "Create a sprint in a project")
    public ResponseEntity<SprintResponse> createSprint(
            @PathVariable UUID projectId,
            @Valid @RequestBody SprintRequest request
    ) {
        SprintResponse response = sprintService.createSprint(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/sprints/{id}/start")
    @Operation(summary = "Start a sprint (transition to ACTIVE)")
    public ResponseEntity<SprintResponse> startSprint(@PathVariable UUID id) {
        return ResponseEntity.ok(sprintService.startSprint(id));
    }

    @PatchMapping("/sprints/{id}/complete")
    @Operation(summary = "Complete an active sprint (transition to COMPLETED)")
    public ResponseEntity<SprintResponse> completeSprint(@PathVariable UUID id) {
        return ResponseEntity.ok(sprintService.completeSprint(id));
    }

    @DeleteMapping("/sprints/{id}")
    @Operation(summary = "Delete a sprint")
    public ResponseEntity<Void> deleteSprint(@PathVariable UUID id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
}
