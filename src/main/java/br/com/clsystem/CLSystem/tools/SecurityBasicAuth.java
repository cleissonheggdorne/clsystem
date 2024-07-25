package br.com.clsystem.CLSystem.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import static org.springframework.security.config.Customizer.withDefaults;

import java.util.function.Supplier;

@Configuration
public class SecurityBasicAuth {
    PasswordEncoderConfig passwordEncoderConfig;

    public SecurityBasicAuth(PasswordEncoderConfig passwordEncoderConfig){
        this.passwordEncoderConfig = passwordEncoderConfig;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth, PasswordEncoder passwordEncoder) throws Exception {
        auth
            .inMemoryAuthentication()
            .withUser("user1")
            .password(passwordEncoder.encode("user1Pass"))
            .authorities("ROLE_USER");
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.withUsername("user1")
            .password(passwordEncoder.encode("user1Pass"))
            .authorities("ROLE_USER")
            .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(httpSecurityCsrfConfigurer ->{httpSecurityCsrfConfigurer.disable();});
        http
            .authorizeHttpRequests(authorizeRequests ->
                 authorizeRequests
                 .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults()); // Aplica a configuração padrão do httpBasic

        return http.build();
    }

 
}