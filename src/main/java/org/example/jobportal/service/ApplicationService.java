package org.example.jobportal.service;

import org.example.jobportal.model.Application;
import org.example.jobportal.model.Job;
import org.example.jobportal.model.User;
import org.example.jobportal.repository.ApplicationRepository;
import org.example.jobportal.repository.JobRepository;
import org.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public Application applyJob(Application application, Long jobId, Long userId) {

        Job job = jobRepository.findById(jobId).orElseThrow();

        User user = userRepository.findById(userId).orElseThrow();

        application.setJob(job);
        application.setUser(user);

        application.setStatus("Pending");

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUser_Id(userId);
    }

    public Application updateStatus(Long id, String status) {

        Application application =
                applicationRepository.findById(id).orElseThrow();

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}