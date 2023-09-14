package br.com.clsystem.CLSystem.model.entities.record;

import java.math.BigDecimal;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotNull;

@Validated
public record CashierRecord(
		Long idCashier,
		BigDecimal initialValue,
		@NotNull
		Long idEmployee
		) {
}
