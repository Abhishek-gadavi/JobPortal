package org.example.jobportal.controller;

import org.example.jobportal.model.Application;
import org.example.jobportal.service.ApplicationService;
import org.example.jobportal.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping(value = "/apply/{jobId}/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<?> applyJob(
            @PathVariable Long jobId,
            @PathVariable Long userId,
            @RequestParam("applicantName") String applicantName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("resume") MultipartFile resume) {

        try {

            String fileName = fileUploadService.uploadResume(resume);

            Application application = new Application();
            application.setApplicantName(applicantName);
            application.setEmail(email);
            application.setPhone(phone);
            application.setResume(fileName);

            Application saved = applicationService.applyJob(application, jobId, userId);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getClass().getName() + " : " + e.getMessage());
        }
    }


    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/user/{userId}")
    public List<Application> getApplicationsByUser(@PathVariable Long userId) {
        return applicationService.getApplicationsByUser(userId);
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService.updateStatus(id, status);
    }
}