package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleProjection {
    Long getIdSale();
    String getFormPayment();
    LocalDateTime getDateHourEntry();
    List<ItemSaleProjection> getListItems();
    BigDecimal getAmount();
}
