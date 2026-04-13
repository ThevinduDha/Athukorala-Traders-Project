package com.athukorala.inventory_system.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ✅ PUBLIC APIs
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/promotions/**",
                                "/api/inventory/**",
                                "/api/suppliers/**",
                                "/api/users/**"
                        ).permitAll()

                        // 🔐 ALL OTHER APIs REQUIRE LOGIN
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}