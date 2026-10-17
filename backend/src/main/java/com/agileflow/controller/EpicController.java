package com.agileflow.controller;

import com.agileflow.dto.EpicRequest;
import com.agileflow.dto.EpicResponse;
import com.agileflow.service.EpicService;
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
@Tag(name = "Epics", description = "Epic management operations")
public class EpicController {

    private final EpicService epicService;

    public EpicController(EpicService epicService) {
        this.epicService = epicService;
    }

    @GetMapping("/projects/{projectId}/epics")
    @Operation(summary = "List epics for a project")
    public ResponseEntity<List<EpicResponse>> getEpicsByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(epicService.getEpicsByProject(projectId));
    }

    @PostMapping("/projects/{projectId}/epics")
    @Operation(summary = "Create an epic under a project")
    public ResponseEntity<EpicResponse> createEpic(
            @PathVariable UUID projectId,
            @Valid @RequestBody EpicRequest request
    ) {
        EpicResponse response = epicService.createEpic(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/epics/{id}")
    @Operation(summary = "Delete an epic")
    public ResponseEntity<Void> deleteEpic(@PathVariable UUID id) {
        epicService.deleteEpic(id);
        return ResponseEntity.noContent().build();
    }
}
