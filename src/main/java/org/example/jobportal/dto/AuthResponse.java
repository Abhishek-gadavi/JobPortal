package org.example.jobportal.dto;



import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String role;

    private Long userId;
    private String username;
    private String email;
    private String phone;
}
