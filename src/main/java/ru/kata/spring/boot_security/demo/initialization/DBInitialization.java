package ru.kata.spring.boot_security.demo.initialization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.entityes.Role;
import ru.kata.spring.boot_security.demo.entityes.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class DBInitialization {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DBInitialization(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        if (roleService.getRoles().isEmpty()) {
            Role adminRole = new Role("ROLE_ADMIN");
            roleService.addRole(adminRole);

            Role userRole = new Role("ROLE_USER");
            roleService.addRole(userRole);

            User admin = new User();
            admin.setUserName("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@example.com");
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);
            userService.save(admin);

            User user = new User();
            user.setUserName("user");
            user.setPassword("user123");
            user.setEmail("user@example.com");
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);
            user.setRoles(userRoles);
            userService.save(user);
        }
    }
}
