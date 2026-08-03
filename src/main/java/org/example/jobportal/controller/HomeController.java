package org.example.jobportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/index.html";
    }

    @GetMapping("/register")
    public String register() {
        return "redirect:/register.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/jobs")
    public String jobs() {
        return "redirect:/jobs.html";
    }

    @GetMapping("/apply")
    public String apply() {
        return "redirect:/apply.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/dashboard.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "redirect:/admin.html";
    }
}