package com.agileflow.service;

import com.agileflow.dto.CreateIssueRequest;
import com.agileflow.dto.IssueResponse;
import com.agileflow.dto.SubTaskDto;
import com.agileflow.dto.UpdateIssueRequest;
import com.agileflow.dto.UpdateIssueStatusRequest;
import com.agileflow.exception.ResourceNotFoundException;
import com.agileflow.model.Epic;
import com.agileflow.model.Issue;
import com.agileflow.model.Project;
import com.agileflow.model.Sprint;
import com.agileflow.model.SubTask;
import com.agileflow.model.enums.IssueStatus;
import com.agileflow.repository.IssueRepository;
import com.agileflow.repository.SprintRepository;
import com.agileflow.repository.SubTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class IssueService {

    private final IssueRepository issueRepository;
    private final SubTaskRepository subTaskRepository;
    private final SprintRepository sprintRepository;
    private final ProjectService projectService;
    private final EpicService epicService;

    public IssueService(
            IssueRepository issueRepository,
            SubTaskRepository subTaskRepository,
            SprintRepository sprintRepository,
            ProjectService projectService,
            EpicService epicService
    ) {
        this.issueRepository = issueRepository;
        this.subTaskRepository = subTaskRepository;
        this.sprintRepository = sprintRepository;
        this.projectService = projectService;
        this.epicService = epicService;
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesByProject(UUID projectId) {
        return issueRepository.findByProjectIdOrderByRankAsc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));
        return toResponse(issue);
    }

    public IssueResponse createIssue(UUID projectId, CreateIssueRequest request) {
        Project project = projectService.findEntityById(projectId);
        long count = issueRepository.countByProjectId(projectId) + 1;
        String key = project.getKey() + "-" + count;

        Issue issue = new Issue(project, key, request.title().trim(), request.issueType());
        issue.setDescription(request.description());
        issue.setStatus(IssueStatus.TODO);
        issue.setStoryPoints(request.storyPoints());

        int nextRank = issueRepository.findMaxRankByProjectIdAndStatus(projectId, IssueStatus.TODO) + 1;
        issue.setRank(nextRank);

        if (request.epicId() != null) {
            Epic epic = epicService.findEntityById(request.epicId());
            issue.setEpic(epic);
        }

        if (request.sprintId() != null) {
            Sprint sprint = sprintRepository.findById(request.sprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.sprintId()));
            issue.setSprint(sprint);
        }

        Issue saved = issueRepository.save(issue);
        return toResponse(saved);
    }

    public IssueResponse updateIssue(UUID id, UpdateIssueRequest request) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issue.setTitle(request.title().trim());
        issue.setDescription(request.description());
        issue.setIssueType(request.issueType());
        issue.setStatus(request.status());
        issue.setStoryPoints(request.storyPoints());
        if (request.rank() != null) {
            issue.setRank(request.rank());
        }

        if (request.epicId() != null) {
            Epic epic = epicService.findEntityById(request.epicId());
            issue.setEpic(epic);
        } else {
            issue.setEpic(null);
        }

        if (request.sprintId() != null) {
            Sprint sprint = sprintRepository.findById(request.sprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.sprintId()));
            issue.setSprint(sprint);
        } else {
            issue.setSprint(null);
        }

        Issue updated = issueRepository.save(issue);
        return toResponse(updated);
    }

    public IssueResponse updateIssueStatus(UUID id, UpdateIssueStatusRequest request) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issue.setStatus(request.status());
        if (request.rank() != null) {
            issue.setRank(request.rank());
        } else {
            int nextRank = issueRepository.findMaxRankByProjectIdAndStatus(issue.getProject().getId(), request.status()) + 1;
            issue.setRank(nextRank);
        }

        Issue updated = issueRepository.save(issue);
        return toResponse(updated);
    }

    public void deleteIssue(UUID id) {
        if (!issueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Issue not found with id: " + id);
        }
        issueRepository.deleteById(id);
    }

    public SubTaskDto.SubTaskResponse addSubTask(UUID issueId, SubTaskDto.SubTaskRequest request) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        int nextOrder = issue.getSubtasks().size();
        SubTask subTask = new SubTask(issue, request.title().trim(), request.isCompleted(), nextOrder);
        issue.addSubTask(subTask);
        SubTask saved = subTaskRepository.save(subTask);
        return new SubTaskDto.SubTaskResponse(saved.getId(), saved.getTitle(), saved.isCompleted(), saved.getOrderIndex());
    }

    public SubTaskDto.SubTaskResponse updateSubTask(UUID subTaskId, SubTaskDto.SubTaskRequest request) {
        SubTask subTask = subTaskRepository.findById(subTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with id: " + subTaskId));

        subTask.setTitle(request.title().trim());
        subTask.setCompleted(request.isCompleted());
        subTask.setOrderIndex(request.orderIndex());
        SubTask saved = subTaskRepository.save(subTask);
        return new SubTaskDto.SubTaskResponse(saved.getId(), saved.getTitle(), saved.isCompleted(), saved.getOrderIndex());
    }

    public void deleteSubTask(UUID subTaskId) {
        SubTask subTask = subTaskRepository.findById(subTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with id: " + subTaskId));
        subTask.getIssue().removeSubTask(subTask);
        subTaskRepository.delete(subTask);
    }

    private IssueResponse toResponse(Issue issue) {
        List<SubTaskDto.SubTaskResponse> subTaskResponses = issue.getSubtasks()
                .stream()
                .map(st -> new SubTaskDto.SubTaskResponse(st.getId(), st.getTitle(), st.isCompleted(), st.getOrderIndex()))
                .toList();

        return new IssueResponse(
                issue.getId(),
                issue.getProject().getId(),
                issue.getProject().getKey(),
                issue.getEpic() != null ? issue.getEpic().getId() : null,
                issue.getEpic() != null ? issue.getEpic().getKey() : null,
                issue.getEpic() != null ? issue.getEpic().getTitle() : null,
                issue.getEpic() != null ? issue.getEpic().getColor() : null,
                issue.getSprint() != null ? issue.getSprint().getId() : null,
                issue.getKey(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getIssueType(),
                issue.getStatus(),
                issue.getStoryPoints(),
                issue.getRank(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                subTaskResponses
        );
    }
}
