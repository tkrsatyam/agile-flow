package com.agileflow.controller;

import com.agileflow.dto.CreateIssueRequest;
import com.agileflow.dto.IssueResponse;
import com.agileflow.dto.SubTaskDto;
import com.agileflow.dto.UpdateIssueRequest;
import com.agileflow.dto.UpdateIssueStatusRequest;
import com.agileflow.service.IssueService;
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
@Tag(name = "Issues & Tasks", description = "User stories, defects, tasks, and subtasks")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/projects/{projectId}/issues")
    @Operation(summary = "List all issues for a project")
    public ResponseEntity<List<IssueResponse>> getIssuesByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(issueService.getIssuesByProject(projectId));
    }

    @GetMapping("/issues/{id}")
    @Operation(summary = "Get issue by ID")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable UUID id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @PostMapping("/projects/{projectId}/issues")
    @Operation(summary = "Create an issue in a project")
    public ResponseEntity<IssueResponse> createIssue(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateIssueRequest request
    ) {
        IssueResponse response = issueService.createIssue(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/issues/{id}")
    @Operation(summary = "Update an issue")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIssueRequest request
    ) {
        IssueResponse response = issueService.updateIssue(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/issues/{id}/status")
    @Operation(summary = "Update issue status and column rank (Kanban transition)")
    public ResponseEntity<IssueResponse> updateIssueStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIssueStatusRequest request
    ) {
        IssueResponse response = issueService.updateIssueStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/issues/{id}")
    @Operation(summary = "Delete an issue")
    public ResponseEntity<Void> deleteIssue(@PathVariable UUID id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/issues/{issueId}/subtasks")
    @Operation(summary = "Add a subtask to an issue")
    public ResponseEntity<SubTaskDto.SubTaskResponse> addSubTask(
            @PathVariable UUID issueId,
            @Valid @RequestBody SubTaskDto.SubTaskRequest request
    ) {
        SubTaskDto.SubTaskResponse response = issueService.addSubTask(issueId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/subtasks/{subTaskId}")
    @Operation(summary = "Update a subtask (toggle completion or change title)")
    public ResponseEntity<SubTaskDto.SubTaskResponse> updateSubTask(
            @PathVariable UUID subTaskId,
            @Valid @RequestBody SubTaskDto.SubTaskRequest request
    ) {
        SubTaskDto.SubTaskResponse response = issueService.updateSubTask(subTaskId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/subtasks/{subTaskId}")
    @Operation(summary = "Delete a subtask")
    public ResponseEntity<Void> deleteSubTask(@PathVariable UUID subTaskId) {
        issueService.deleteSubTask(subTaskId);
        return ResponseEntity.noContent().build();
    }
}
