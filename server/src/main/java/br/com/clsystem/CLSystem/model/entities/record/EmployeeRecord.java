package br.com.clsystem.CLSystem.model.entities.record;

import java.util.Date;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@Validated
public record EmployeeRecord(
		
		Long idEmployee,
	    @NotBlank(message = "Nome do Produto Precisa ser Inserido!")
		String nameEmployee,
		@NotBlank
		String document,
		Date initialDate,
		@NotBlank(message = "Senha deve ser inserida!")
		String password
		) {
}
