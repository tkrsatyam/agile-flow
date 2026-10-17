package com.agileflow.repository;

import com.agileflow.model.Sprint;
import com.agileflow.model.enums.SprintState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, UUID> {
    List<Sprint> findByProjectId(UUID projectId);
    List<Sprint> findByProjectIdAndState(UUID projectId, SprintState state);
    Optional<Sprint> findFirstByProjectIdAndState(UUID projectId, SprintState state);
}
