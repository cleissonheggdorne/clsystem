package br.com.clsystem.CLSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins="*", maxAge = 3600) //Permitir ser acessado de Qualquer fonte
@RequestMapping("/api")
public class Login {
    ]
    private AuthenticationManager authenticationManager;

    public Login(AuthenticationManager authenticationManager){
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/public/employee/login")
    public String login(@RequestBody Login Login) {
        try {
            // Cria o token de autenticação
            UsernamePasswordAuthenticationToken authenticationToken = 
                new UsernamePasswordAuthenticationToken(Login.user(), Login.password());

            // Autentica o token
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // Verifica se a autenticação foi bem-sucedida
            if (authentication.isAuthenticated()) {
                return "Login successful!";
            } else {
                return "Login failed!";
            }
        } catch (AuthenticationException e) {
            return "Login failed: " + e.getMessage();
        }
    }
}
