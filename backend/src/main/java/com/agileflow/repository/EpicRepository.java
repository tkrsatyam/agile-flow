package com.agileflow.repository;

import com.agileflow.model.Epic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EpicRepository extends JpaRepository<Epic, UUID> {
    List<Epic> findByProjectId(UUID projectId);
    Optional<Epic> findByProjectIdAndKey(UUID projectId, String key);
    long countByProjectId(UUID projectId);
}
