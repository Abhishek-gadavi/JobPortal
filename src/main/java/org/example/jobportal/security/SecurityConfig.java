package org.example.jobportal.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    // ==========================
    // PASSWORD ENCODER
    // ==========================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // ==========================
    // AUTHENTICATION PROVIDER
    // ==========================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }


    // ==========================
    // AUTHENTICATION MANAGER
    // ==========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // ==========================
    // SECURITY FILTER CHAIN
    // ==========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // JWT API -> CSRF disabled
                .csrf(csrf -> csrf.disable())


                // No HTTP session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // ==========================
                // AUTHORIZATION
                // ==========================

                .authorizeHttpRequests(auth -> auth


                        // ==========================
                        // FRONTEND PAGES
                        // ==========================

                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/jobs.html",
                                "/dashboard.html",
                                "/apply.html",
                                "/admin.html",
                                "/favicon.ico",
                                "/error"
                        )
                        .permitAll()


                        // ==========================
                        // STATIC FILES
                        // ==========================

                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        )
                        .permitAll()


                        // ==========================
                        // AUTH APIs
                        // ==========================

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        // ==========================
                        // JOBS - PUBLIC GET
                        // ==========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs",
                                "/api/jobs/**"
                        )
                        .permitAll()


                        // ==========================
                        // JOB CREATE - ADMIN
                        // ==========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs",
                                "/api/jobs/**"
                        )
                        .hasRole("ADMIN")


                        // ==========================
                        // JOB UPDATE - ADMIN
                        // ==========================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/**"
                        )
                        .hasRole("ADMIN")


                        // ==========================
                        // JOB DELETE - ADMIN
                        // ==========================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/**"
                        )
                        .hasRole("ADMIN")


                        // ==========================
                        // CANDIDATE APPLICATIONS
                        // ==========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/apply",
                                "/api/applications/apply/**"
                        )
                        .hasAnyRole("CANDIDATE", "ADMIN")


                        // Candidate can see own applications
                        // Admin can also access
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/user/**"
                        )
                        .hasAnyRole(
                                "CANDIDATE",
                                "ADMIN"
                        )


                        // ==========================
                        // ADMIN APPLICATION MANAGEMENT
                        // ==========================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/**"
                        )
                        .hasRole("ADMIN")


                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/applications/**"
                        )
                        .hasRole("ADMIN")


                        // ==========================
                        // EVERYTHING ELSE
                        // ==========================

                        .anyRequest()
                        .authenticated()
                )


                // Authentication provider
                .authenticationProvider(
                        authenticationProvider()
                )


                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}