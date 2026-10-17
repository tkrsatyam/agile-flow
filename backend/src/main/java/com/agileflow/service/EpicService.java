package com.agileflow.service;

import com.agileflow.dto.EpicRequest;
import com.agileflow.dto.EpicResponse;
import com.agileflow.exception.ResourceNotFoundException;
import com.agileflow.model.Epic;
import com.agileflow.model.Project;
import com.agileflow.model.enums.EpicStatus;
import com.agileflow.repository.EpicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EpicService {

    private final EpicRepository epicRepository;
    private final ProjectService projectService;

    public EpicService(EpicRepository epicRepository, ProjectService projectService) {
        this.epicRepository = epicRepository;
        this.projectService = projectService;
    }

    @Transactional(readOnly = true)
    public List<EpicResponse> getEpicsByProject(UUID projectId) {
        return epicRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public EpicResponse createEpic(UUID projectId, EpicRequest request) {
        Project project = projectService.findEntityById(projectId);
        long nextIndex = epicRepository.countByProjectId(projectId) + 1;
        String key = project.getKey() + "-E" + nextIndex;

        Epic epic = new Epic(
                project,
                key,
                request.title().trim(),
                request.color() != null && !request.color().isBlank() ? request.color() : "#6366F1",
                request.status() != null ? request.status() : EpicStatus.OPEN
        );

        Epic saved = epicRepository.save(epic);
        return toResponse(saved);
    }

    public void deleteEpic(UUID id) {
        if (!epicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Epic not found with id: " + id);
        }
        epicRepository.deleteById(id);
    }

    public Epic findEntityById(UUID id) {
        return epicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Epic not found with id: " + id));
    }

    private EpicResponse toResponse(Epic epic) {
        return new EpicResponse(
                epic.getId(),
                epic.getProject().getId(),
                epic.getKey(),
                epic.getTitle(),
                epic.getColor(),
                epic.getStatus(),
                epic.getIssues() != null ? epic.getIssues().size() : 0
        );
    }
}
