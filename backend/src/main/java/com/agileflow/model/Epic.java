package com.agileflow.model;

import com.agileflow.model.enums.EpicStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "epics")
public class Epic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @NotBlank
    @Size(max = 20)
    @Column(name = "epic_key", nullable = false, length = 20)
    private String key;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @Size(max = 30)
    @Column(length = 30)
    private String color = "#6366F1";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EpicStatus status = EpicStatus.OPEN;

    @JsonIgnore
    @OneToMany(mappedBy = "epic", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Issue> issues = new ArrayList<>();

    public Epic() {
    }

    public Epic(Project project, String key, String title, String color, EpicStatus status) {
        this.project = project;
        this.key = key;
        this.title = title;
        this.color = color != null ? color : "#6366F1";
        this.status = status != null ? status : EpicStatus.OPEN;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public EpicStatus getStatus() {
        return status;
    }

    public void setStatus(EpicStatus status) {
        this.status = status;
    }

    public List<Issue> getIssues() {
        return issues;
    }

    public void setIssues(List<Issue> issues) {
        this.issues = issues;
    }
}
