package br.com.clsystem.CLSystem.model.entities.record;

import java.util.Date;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;

@Validated
public record EmployeeRecord(
		
		Long idEmployee,
	    @NotBlank(message = "Nome do Produto Precisa ser Inserido!")
		String nameEmployee,
		@NotBlank
		String document,
		@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
		Date initialDate,
		@NotBlank(message = "Senha deve ser inserida!")
		String password
		) {
}
