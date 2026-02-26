package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> findAll();
    User findById(Long id);
    User findUserByUsername(String username);
    List<Role> findAllRoles();
    void save(User user);
    void update(User user);
    void delete(Long id);
}
