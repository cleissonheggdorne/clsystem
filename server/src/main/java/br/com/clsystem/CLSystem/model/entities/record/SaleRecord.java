package br.com.clsystem.CLSystem.model.entities.record;

import java.time.LocalDateTime;
import java.util.List;

import br.com.clsystem.CLSystem.types.FormPayment;
import jakarta.validation.constraints.NotNull;

public record SaleRecord(
		Long idSale,
		@NotNull
		FormPayment formPayment,
		@NotNull
		Long idCashier,
		@NotNull
		LocalDateTime dateHourSale,
		List<ItemSaleRecord> listItens 
		) {

}
