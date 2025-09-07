package br.com.clsystem.CLSystem.model.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.repositories.VerificationTokenRepository;

@Service
public class VerificationTokenService {
    private VerificationTokenRepository verificationTokenRepository;
    
    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public VerificationToken createVerificationToken(String email) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setEmail(email);
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setUsed(false);
        return verificationTokenRepository.save(verificationToken);
    }

    public Optional<VerificationToken> findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public void update(VerificationToken verificationToken) {
        verificationTokenRepository.save(verificationToken);
    }
}
