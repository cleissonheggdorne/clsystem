package br.com.clsystem.CLSystem.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.services.EmployeeService;
import br.com.clsystem.CLSystem.model.services.VerificationTokenService;

@RequestMapping("/api")
@Controller
public class VerificationTokenController {
    final VerificationTokenService verificationTokenService;
    final EmployeeService employeeService;

    public VerificationTokenController(VerificationTokenService verificationTokenService, EmployeeService employeeService) {
        this.verificationTokenService = verificationTokenService;
        this.employeeService = employeeService;
    }

    @GetMapping("/public/verification")
    public ResponseEntity<?> confirmarEmail(@RequestParam("token") String token) {
        // 1. Busca o token
        VerificationToken verificationToken = verificationTokenService.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        // 2. Verifica se já foi usado
        if (verificationToken.isUsed()) {
            return ResponseEntity.badRequest().body("Código de confirmação já utilizado anteriormente. Tente fazer o login normalmente.");
        }
        
        // 4. Tudo certo! Atualiza o usuário e o token
        Employee employee = employeeService.findByEmail(verificationToken.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o código fornecido"));

        employee.setEmailConfirmed(true);
        employeeService.updateEmployee(employee);

        verificationToken.setUsed(true);
        verificationTokenService.update(verificationToken);

        return ResponseEntity.ok().body(Map.of("message", "Email confirmado com sucesso!"));
    }
}
