package com.agileflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

@Entity
@Table(name = "subtasks")
public class SubTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 0;

    public SubTask() {
    }

    public SubTask(Issue issue, String title, boolean isCompleted, int orderIndex) {
        this.issue = issue;
        this.title = title;
        this.isCompleted = isCompleted;
        this.orderIndex = orderIndex;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
