package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;

public interface ItemSaleProjection {
    Integer getQuantity();
    BigDecimal getAmount();
    BigDecimal getUnitaryValue();
    String getIdProductNameProduct();
}
