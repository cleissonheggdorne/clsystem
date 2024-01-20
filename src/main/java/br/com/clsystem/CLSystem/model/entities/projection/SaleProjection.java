package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleProjection {
    String getFormPayment();
    LocalDateTime getDateHourEntry();
    List<ItemSaleProjection> getListItems();
    BigDecimal getAmount();
    void calculateAmount();

    // public BigDecimal calculateAmountSale(){
    //     getListItems().stream()
	// 	.map(ItemSaleProjection::getAmount)
	// 	.reduce(new BigDecimal(0.0), BigDecimal::add);
    // }
}
