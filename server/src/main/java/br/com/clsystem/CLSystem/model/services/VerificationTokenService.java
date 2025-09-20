package br.com.clsystem.CLSystem.model.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.repositories.VerificationTokenRepository;

@Service
public class VerificationTokenService {
    private VerificationTokenRepository verificationTokenRepository;
    
    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public VerificationToken createVerificationToken(Employee employee) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setEmail(employee.getEmail());
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setUsed(false);
        verificationToken.setEmployee(employee);
        return verificationTokenRepository.save(verificationToken);
    }

    public Optional<VerificationToken> findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public void update(VerificationToken verificationToken) {
        verificationTokenRepository.save(verificationToken);
    }
}
