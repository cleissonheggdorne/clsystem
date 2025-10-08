package br.com.clsystem.CLSystem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.services.EmployeeService;
import br.com.clsystem.CLSystem.model.services.VerificationTokenService;
import br.com.clsystem.CLSystem.types.TypeToken;
import jakarta.validation.Valid;
import br.com.clsystem.CLSystem.model.entities.record.PasswordResetRecord;


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
    public ResponseEntity<?> verificationEmail(@RequestParam("token") String token) {
        // 1. Busca o token
        VerificationToken verificationToken = verificationTokenService.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        // 2. Verifica se já foi usado
        if (verificationToken.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("error", "TOKEN_ALREADY_USED",
                "message", "Código de confirmação já utilizado. Tente fazer o login normalmente ou redefina a senha caso a tenha perdido."));
        }

        if(!(verificationToken.getTypeToken() == TypeToken.VERIFICATION)) {
            return ResponseEntity.badRequest().body(Map.of("error", "INVALID_TOKEN_TYPE",
                "message", "Tipo de token inválido para essa operação."));
        }
        
        // 4. Tudo certo! Atualiza o usuário e o token
        Employee employee = verificationToken.getEmployee();

        employee.setEmailConfirmed(true);
        employeeService.updateEmployee(employee);

        verificationToken.setUsed(true);
        verificationTokenService.update(verificationToken);

        return ResponseEntity.ok().body(Map.of("message", "Email confirmado com sucesso!"));
    }

    @GetMapping("/public/verification/send-redefine")
    public ResponseEntity<?> redefinePassword(@RequestParam("email") String email) {
        verificationTokenService.createAndSendToken(email);
        return ResponseEntity.ok().body(Map.of("message", "Se existir um usuário com esse e-mail, um link de redefinição de senhas será enviado."));
    }

    @PostMapping("/public/verification/redefine-password")
    public ResponseEntity<?> verificationResetPassword(@RequestParam("token") String token,
        @RequestBody @Valid PasswordResetRecord passwords) {
        ResponseEntity<?> response = verificationTokenService.verificationResetPassword(token, passwords);
        return response;
    }
}
