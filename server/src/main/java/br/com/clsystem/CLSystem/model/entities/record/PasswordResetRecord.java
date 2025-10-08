package br.com.clsystem.CLSystem.model.entities.record;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@Validated
public record PasswordResetRecord(
		
	    @NotBlank(message = "Senha deve ser informado!")
		String password,
		@NotBlank(message = "Confirmação da senha deve ser informada")
		String confirmPassword
		) {
}
