package org.example.jobportal.repository;

import jakarta.transaction.Transactional;
import org.example.jobportal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser_Id(Long userId);

    @Transactional
    void deleteByJob_Id(Long jobId);

}