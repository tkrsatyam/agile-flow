package com.agileflow.service;

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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DirtiesContext
@Transactional
class ProjectServiceTest {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private EpicService epicService;

    @Autowired
    private IssueService issueService;

    @Test
    void testCreateProjectAndWorkflowHierarchy() {
        // 1. Create Project
        ProjectResponse project = projectService.createProject(new ProjectRequest("TEST", "Test Project", "Description"));
        assertNotNull(project.id());
        assertEquals("TEST", project.key());

        // 2. Create Epic
        EpicResponse epic = epicService.createEpic(project.id(), new EpicRequest("Backend Core", "#6366F1", EpicStatus.IN_PROGRESS));
        assertNotNull(epic.id());
        assertEquals("TEST-E1", epic.key());

        // 3. Create Issue
        IssueResponse issue = issueService.createIssue(project.id(), new CreateIssueRequest(
                "First Story",
                "Story description",
                IssueType.STORY,
                epic.id(),
                null,
                5
        ));
        assertNotNull(issue.id());
        assertEquals("TEST-1", issue.key());
        assertEquals(IssueStatus.TODO, issue.status());
        assertEquals(5, issue.storyPoints());

        // 4. Add Subtask
        SubTaskDto.SubTaskResponse subtask = issueService.addSubTask(
                issue.id(),
                new SubTaskDto.SubTaskRequest("Write tests", false, 0)
        );
        assertNotNull(subtask.id());
        assertFalse(subtask.isCompleted());

        // 5. Update Status (Kanban move to IN_PROGRESS)
        IssueResponse moved = issueService.updateIssueStatus(issue.id(), new UpdateIssueStatusRequest(IssueStatus.IN_PROGRESS, 1));
        assertEquals(IssueStatus.IN_PROGRESS, moved.status());

        // 6. Verify Project Query
        List<IssueResponse> issues = issueService.getIssuesByProject(project.id());
        assertEquals(1, issues.size());
        assertEquals(1, issues.getFirst().subtasks().size());
    }
}
