package org.example.jobportal.service;

import org.example.jobportal.model.Job;
import org.example.jobportal.repository.ApplicationRepository;
import org.example.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Job addJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public void deleteJob(Long id) {

        applicationRepository.deleteByJob_Id(id);

        jobRepository.deleteById(id);

    }
    public Job updateJob(Long id, Job updatedJob) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(updatedJob.getTitle());
        job.setCompany(updatedJob.getCompany());
        job.setLocation(updatedJob.getLocation());
        job.setSalary(updatedJob.getSalary());
        job.setSkills(updatedJob.getSkills());
        job.setExperience(updatedJob.getExperience());
        job.setDescription(updatedJob.getDescription());

        return jobRepository.save(job);
    }
}