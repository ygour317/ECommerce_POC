package com.example.ecommerce.config;

import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default accounts on first startup (H2 in-memory resets each run, so this runs every time
 * the users table is empty). Password is always encoded with {@link PasswordEncoder}.
 * <p>
 * admin@example.com / Password123 — ADMIN (can create/update/delete products)
 * demo@example.com / Password123 — USER (browse only)
 */
@Component
@Order(1)
public class DevUserSeed implements ApplicationRunner {

    private static final String DEMO_PASSWORD = "Password123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevUserSeed(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
            admin.setFullName("Store Admin");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (!userRepository.existsByEmail("demo@example.com")) {
            User demo = new User();
            demo.setEmail("demo@example.com");
            demo.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
            demo.setFullName("Demo Shopper");
            demo.setRole(Role.USER);
            userRepository.save(demo);
        }
    }
}
