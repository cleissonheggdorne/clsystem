package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;
public interface ItemSaleProjection {
    Long getIdItemSale();
    Integer getQuantity();
    BigDecimal getUnitaryValue();
    ProductProjection getIdProduct();
}
