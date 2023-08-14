package br.com.clsystem.CLSystem.model.entities.record;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;

import br.com.clsystem.CLSystem.types.StatusCashier;
import jakarta.validation.constraints.NotNull;

@Validated
public record CashierRecord(
		Long idCashier,
		BigDecimal initialValue,
		@NotNull
		Long idEmployee
		) {
}
