package com.agileflow.repository;

import com.agileflow.model.Issue;
import com.agileflow.model.enums.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {
    List<Issue> findByProjectIdOrderByRankAsc(UUID projectId);
    List<Issue> findByProjectIdAndStatusOrderByRankAsc(UUID projectId, IssueStatus status);
    List<Issue> findByProjectIdAndSprintIdOrderByRankAsc(UUID projectId, UUID sprintId);
    List<Issue> findByProjectIdAndSprintIsNullOrderByRankAsc(UUID projectId);
    List<Issue> findByEpicIdOrderByRankAsc(UUID epicId);
    Optional<Issue> findByKey(String key);
    Optional<Issue> findByProjectIdAndKey(UUID projectId, String key);
    long countByProjectId(UUID projectId);

    @Query("SELECT COALESCE(MAX(i.rank), 0) FROM Issue i WHERE i.project.id = :projectId AND i.status = :status")
    int findMaxRankByProjectIdAndStatus(@Param("projectId") UUID projectId, @Param("status") IssueStatus status);
}
