package br.com.clsystem.CLSystem.model.services;

import java.util.Map;
import java.util.Optional;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.entities.record.PasswordResetRecord;
import br.com.clsystem.CLSystem.model.repositories.VerificationTokenRepository;
import br.com.clsystem.CLSystem.tools.MailService;
import br.com.clsystem.CLSystem.types.TypeToken;

@Service
public class VerificationTokenService {
    private VerificationTokenRepository verificationTokenRepository;
    private EmployeeService employeeService;
    private MailService mailService;
    final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    
    @Value("${app.base-url}")
    private String appBaseUrl;

    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository, EmployeeService employeeService, 
                                    MailService mailService, PasswordEncoder passwordEncoder, MessageSource messageSource) {
        this.verificationTokenRepository = verificationTokenRepository;
        this.employeeService = employeeService;
        this.mailService = mailService;
        this.passwordEncoder = passwordEncoder;
        this.messageSource = messageSource;
    }

    public VerificationToken createVerificationToken(Employee employee, TypeToken typeToken) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setEmail(employee.getEmail());
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setUsed(false);
        verificationToken.setEmployee(employee);
        verificationToken.setTypeToken(typeToken);
        return verificationTokenRepository.save(verificationToken);
    }

    public Optional<VerificationToken> findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public void update(VerificationToken verificationToken) {
        verificationTokenRepository.save(verificationToken);
    }

    public void createAndSendToken(String email){
        Optional<Employee> employee = employeeService.findByEmail(email);
        if (!employee.isPresent()) return;    

        VerificationToken token = createVerificationToken(employee.get(), TypeToken.RESET_PASSWORD);

        // Usando Locale.getDefault() ou um Locale específico como new Locale("pt", "BR")
        String subject = messageSource.getMessage("mail.subject.redefine", null, Locale.getDefault());
        String bodyTemplate = messageSource.getMessage("mail.body.redefine", null, Locale.getDefault());
        String body = String.format(bodyTemplate, getUriResetPassword() + token.getToken() + "&redefine=true");

        mailService.sendEmailHtml(email, subject, body);
    }

    public ResponseEntity<?> verificationResetPassword(String token, PasswordResetRecord passwords) {
        if(!passwords.password().equals(passwords.confirmPassword())){
            return ResponseEntity.badRequest().body(Map.of("error", "PASSWORD_MISMATCH",
                "message", "As senhas informadas não conferem."));

        }
        // 1. Busca o token
        VerificationToken verificationToken = findByToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        // 2. Verifica se já foi usado
        if (verificationToken.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("error", "TOKEN_ALREADY_USED",
                "message", "Código de confirmação já utilizado. Tente fazer o login normalmente ou utilize a opção de redefinição de senha."));
        }

        if(!(verificationToken.getTypeToken() == TypeToken.RESET_PASSWORD)) {
            return ResponseEntity.badRequest().body(Map.of("error", "INVALID_TOKEN_TYPE",
                "message", "Tipo de token inválido para essa operação."));
        }
        
        Employee employee = verificationToken.getEmployee();
     
        // 3. Tudo certo! Atualiza o usuário e o token
        employee.setPassword(passwordEncoder.encode(passwords.password()));

        employee.setEmailConfirmed(true);
        employeeService.updateEmployee(employee);

        verificationToken.setUsed(true);
        update(verificationToken);
        return ResponseEntity.ok().body(Map.of("message", "Email confirmado com sucesso!"));
    }

    String getUriResetPassword(){
            return appBaseUrl + "/#/login?token=";

    }

}
