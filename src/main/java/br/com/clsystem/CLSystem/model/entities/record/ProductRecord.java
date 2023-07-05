package br.com.clsystem.CLSystem.model.entities.record;

import java.math.BigDecimal;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Validated
public record ProductRecord(
		
		long idProduct,
	    @NotBlank(message = "Nome do Produto Precisa ser Inserido!")
		String nameProduct,
		String productDescription,
	    @NotNull(message = "Preço de Venda Deve Ser Inserido!")
	    @Positive
		BigDecimal valueSale,
		BigDecimal valueCost,
		@Size(max=20)
		String barCode
		) {
}
