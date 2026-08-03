package org.example.jobportal.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.nio.file.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin("*")
public class ResumeController {

    private final Path uploadPath =
            Paths.get("uploads/resumes");

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {

        try {

            Path file = uploadPath.resolve(fileName).normalize();

            System.out.println("Requested file : " + fileName);
            System.out.println("Looking in     : " + file.toAbsolutePath());
            System.out.println("Exists         : " + Files.exists(file));

            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}