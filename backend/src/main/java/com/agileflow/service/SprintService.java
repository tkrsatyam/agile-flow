package com.agileflow.service;

import com.agileflow.dto.SprintRequest;
import com.agileflow.dto.SprintResponse;
import com.agileflow.exception.ResourceNotFoundException;
import com.agileflow.model.Issue;
import com.agileflow.model.Project;
import com.agileflow.model.Sprint;
import com.agileflow.model.enums.SprintState;
import com.agileflow.repository.IssueRepository;
import com.agileflow.repository.ProjectRepository;
import com.agileflow.repository.SprintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;

    public SprintService(
            SprintRepository sprintRepository,
            ProjectRepository projectRepository,
            IssueRepository issueRepository
    ) {
        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional(readOnly = true)
    public List<SprintResponse> getSprintsByProject(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        return sprintRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SprintResponse getActiveSprint(UUID projectId) {
        return sprintRepository.findFirstByProjectIdAndState(projectId, SprintState.ACTIVE)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Transactional
    public SprintResponse createSprint(UUID projectId, SprintRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        Sprint sprint = new Sprint(
                project,
                request.name(),
                request.goal(),
                request.state() != null ? request.state() : SprintState.PLANNED,
                request.startDate(),
                request.endDate()
        );

        Sprint saved = sprintRepository.save(sprint);
        return mapToResponse(saved);
    }

    @Transactional
    public SprintResponse startSprint(UUID sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + sprintId));

        sprint.setState(SprintState.ACTIVE);
        return mapToResponse(sprintRepository.save(sprint));
    }

    @Transactional
    public SprintResponse completeSprint(UUID sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + sprintId));

        sprint.setState(SprintState.COMPLETED);
        return mapToResponse(sprintRepository.save(sprint));
    }

    @Transactional
    public void deleteSprint(UUID sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + sprintId));

        // Unlink any issues attached to this sprint
        for (Issue issue : sprint.getIssues()) {
            issue.setSprint(null);
            issueRepository.save(issue);
        }

        sprintRepository.delete(sprint);
    }

    private SprintResponse mapToResponse(Sprint sprint) {
        int count = sprint.getIssues() != null ? sprint.getIssues().size() : 0;
        int points = sprint.getIssues() != null
                ? sprint.getIssues().stream().mapToInt(i -> i.getStoryPoints() != null ? i.getStoryPoints() : 0).sum()
                : 0;

        return new SprintResponse(
                sprint.getId(),
                sprint.getProject().getId(),
                sprint.getName(),
                sprint.getGoal(),
                sprint.getState(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                count,
                points
        );
    }
}
