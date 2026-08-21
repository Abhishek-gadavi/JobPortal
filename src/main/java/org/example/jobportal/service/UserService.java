package org.example.jobportal.service;

import org.example.jobportal.model.User;
import org.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User login(User loginUser) {

        User user = userRepository
                .findByEmail(loginUser.getEmail())
                .orElse(null);

        System.out.println("Input Email: " + loginUser.getEmail());

        System.out.println("Database User: " + user);

        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return user;
        }

        return null;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}