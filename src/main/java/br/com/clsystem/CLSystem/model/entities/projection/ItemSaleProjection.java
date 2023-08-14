package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;

import br.com.clsystem.CLSystem.model.entities.Sale;

public interface ItemSaleProjection {
    Integer getQuantity();
    BigDecimal getAmount();
    BigDecimal getUnitaryValue();
    String getIdProductNameProduct();
    Sale getIdSale();
}
