package com.agileflow.service;

import com.agileflow.dto.ProjectRequest;
import com.agileflow.dto.ProjectResponse;
import com.agileflow.exception.ResourceNotFoundException;
import com.agileflow.model.Project;
import com.agileflow.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectByKey(String key) {
        Project project = projectRepository.findByKey(key.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with key: " + key));
        return toResponse(project);
    }

    public ProjectResponse createProject(ProjectRequest request) {
        String key = request.key().trim().toUpperCase();
        if (projectRepository.existsByKey(key)) {
            throw new IllegalArgumentException("Project key already exists: " + key);
        }

        Project project = new Project(key, request.name().trim(), request.description());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public Project findEntityById(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getKey(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt()
        );
    }
}
