package com.athukorala.inventory_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Industry standard: Encrypts passwords so they are never plain text [cite: 152, 171]
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabled for local development
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Anyone can try to login/signup [cite: 159]
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Only Admins [cite: 105, 164]
                        .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "STAFF") // Admins & Staff [cite: 103, 166]
                        .anyRequest().authenticated() // Everything else needs a login [cite: 62, 161]
                );

        return http.build();
    }
}