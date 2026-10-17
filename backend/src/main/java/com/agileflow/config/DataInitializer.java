package com.agileflow.config;

import com.agileflow.dto.CreateIssueRequest;
import com.agileflow.dto.EpicRequest;
import com.agileflow.dto.EpicResponse;
import com.agileflow.dto.IssueResponse;
import com.agileflow.dto.ProjectRequest;
import com.agileflow.dto.ProjectResponse;
import com.agileflow.dto.SubTaskDto;
import com.agileflow.dto.UpdateIssueStatusRequest;
import com.agileflow.model.enums.EpicStatus;
import com.agileflow.model.enums.IssueStatus;
import com.agileflow.model.enums.IssueType;
import com.agileflow.repository.ProjectRepository;
import com.agileflow.service.EpicService;
import com.agileflow.service.IssueService;
import com.agileflow.service.ProjectService;
import com.agileflow.service.SprintService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final EpicService epicService;
    private final IssueService issueService;
    private final SprintService sprintService;

    public DataInitializer(
            ProjectRepository projectRepository,
            ProjectService projectService,
            EpicService epicService,
            IssueService issueService,
            SprintService sprintService
    ) {
        this.projectRepository = projectRepository;
        this.projectService = projectService;
        this.epicService = epicService;
        this.issueService = issueService;
        this.sprintService = sprintService;
    }

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            log.info("Projects already exist, skipping initial seed.");
            return;
        }

        log.info("Seeding initial AgileFlow workspace...");

        ProjectResponse project = projectService.createProject(new ProjectRequest(
                "FLOW",
                "AgileFlow MVP",
                "Lightweight, touch-friendly Agile project management workspace."
        ));

        EpicResponse epic1 = epicService.createEpic(project.id(), new EpicRequest(
                "Kanban Experience",
                "#3B82F6",
                EpicStatus.IN_PROGRESS
        ));

        EpicResponse epic2 = epicService.createEpic(project.id(), new EpicRequest(
                "Mobile Touch Polish",
                "#10B981",
                EpicStatus.OPEN
        ));

        com.agileflow.dto.SprintResponse sprint1 = sprintService.createSprint(project.id(), new com.agileflow.dto.SprintRequest(
                "Sprint 1 (Foundations)",
                "Deliver core drag-and-drop Kanban board and mobile touch interactions.",
                com.agileflow.model.enums.SprintState.ACTIVE,
                java.time.LocalDate.now(),
                java.time.LocalDate.now().plusWeeks(2)
        ));

        // Issue 1: To Do Story
        IssueResponse issue1 = issueService.createIssue(project.id(), new CreateIssueRequest(
                "Implement single-column swipe gestures on phone viewports",
                "Ensure users on screens < 768px can swipe horizontally between To Do, In Progress, Review, and Done.",
                IssueType.STORY,
                epic2.id(),
                sprint1.id(),
                5
        ));
        issueService.addSubTask(issue1.id(), new SubTaskDto.SubTaskRequest("Detect touch start & touch end coordinates", true, 0));
        issueService.addSubTask(issue1.id(), new SubTaskDto.SubTaskRequest("Animate active column transition", false, 1));

        // Issue 2: In Progress Story
        IssueResponse issue2 = issueService.createIssue(project.id(), new CreateIssueRequest(
                "Smooth 60 FPS drag-and-drop card interaction",
                "Integrate touch-aware DnD with instant optimistic state update and visual drag preview.",
                IssueType.STORY,
                epic1.id(),
                sprint1.id(),
                3
        ));
        issueService.updateIssueStatus(issue2.id(), new UpdateIssueStatusRequest(IssueStatus.IN_PROGRESS, 1));
        issueService.addSubTask(issue2.id(), new SubTaskDto.SubTaskRequest("Wire up drag event handlers", true, 0));
        issueService.addSubTask(issue2.id(), new SubTaskDto.SubTaskRequest("Add column drop highlight styling", true, 1));

        // Issue 3: In Review Bug
        IssueResponse issue3 = issueService.createIssue(project.id(), new CreateIssueRequest(
                "Fix Fibonacci story point badge clipping on narrow cards",
                "Badge numbers 8 and 13 overflow card margin on viewport widths below 380px.",
                IssueType.BUG,
                epic1.id(),
                sprint1.id(),
                2
        ));
        issueService.updateIssueStatus(issue3.id(), new UpdateIssueStatusRequest(IssueStatus.REVIEW, 1));

        // Issue 4: Done Task
        IssueResponse issue4 = issueService.createIssue(project.id(), new CreateIssueRequest(
                "Set up Spring Boot 4 + Java 25 backend REST endpoints",
                "Initialize Project, Epic, Issue, and SubTask domain services and OpenAPI docs.",
                IssueType.TASK,
                epic1.id(),
                sprint1.id(),
                3
        ));
        issueService.updateIssueStatus(issue4.id(), new UpdateIssueStatusRequest(IssueStatus.DONE, 1));
        issueService.addSubTask(issue4.id(), new SubTaskDto.SubTaskRequest("Define JPA Entities & Repositories", true, 0));
        issueService.addSubTask(issue4.id(), new SubTaskDto.SubTaskRequest("Configure Springdoc OpenAPI 3.0", true, 1));

        log.info("Initial seed completed successfully for project FLOW.");
    }
}
