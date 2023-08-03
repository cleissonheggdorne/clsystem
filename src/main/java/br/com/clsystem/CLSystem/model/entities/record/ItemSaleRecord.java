package br.com.clsystem.CLSystem.model.entities.record;

import jakarta.validation.constraints.NotNull;

public record ItemSaleRecord(
		
		Long idSale,
		@NotNull
		Long idProduct,
		@NotNull
		Integer quantity,
		@NotNull
		Long idCashier
	) {
}
