package br.com.clsystem.CLSystem.model.entities.record;

import java.util.UUID;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@Validated
public record CustomerRecord (
    UUID idCustomer,
    @NotBlank(message = "Nome do Cliente Precisa ser Inserido!")
    String name,
    @NotBlank(message = "Documento do Cliente Precisa ser Inserido!")
    String document,
    @NotBlank(message = "Email do Cliente Precisa ser Inserido!")
    String email,
    @NotBlank(message = "Senha do Cliente Precisa ser Inserida!")
    String password
){}
