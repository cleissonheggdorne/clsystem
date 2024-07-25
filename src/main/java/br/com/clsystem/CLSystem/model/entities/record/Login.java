package br.com.clsystem.CLSystem.model.entities.record;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@Validated
public record Login(
		
	    @NotBlank(message = "Usuário deve ser informado!")
		String user,
		@NotBlank(message = "Senha deve ser inserida!")
		String password
		) {
}
