package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;


public interface ProductProjection {
    Long getIdProduct();
    String getNameProduct();
    BigDecimal getValueSale();
   // Sale getIdSale();
}
