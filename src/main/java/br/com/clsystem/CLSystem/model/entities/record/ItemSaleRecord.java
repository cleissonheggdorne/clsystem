package br.com.clsystem.CLSystem.model.entities.record;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public record ItemSaleRecord(
		@NotNull
		Long idProduct,
		@NotNull
		BigDecimal unitaryValue,
		@NotNull
		Integer quantity
		) {

}
