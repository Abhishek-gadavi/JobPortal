package org.example.jobportal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    private String location;

    private String salary;

    @Column(length = 50000)
    private String description;

    private String experience;

    private String skills;



    @JsonIgnore
    @OneToMany(mappedBy = "job",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

}