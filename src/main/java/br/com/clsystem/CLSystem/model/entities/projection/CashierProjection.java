package br.com.clsystem.CLSystem.model.entities.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;


import br.com.clsystem.CLSystem.types.StatusCashier;

public interface CashierProjection {
    Long getIdCashier();
    LocalDateTime getdateHourOpen();
    LocalDateTime getDateHourClose();
    StatusCashier getStatus();
    EmployeeProjection getEmployee();
    @Value("#{target.getAmountSales()}")
    BigDecimal getAmountSales();

    default String getDateHourOpenFormatted(){
         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
         return getdateHourOpen().format(formatter);
    }

    default String getDateHourCloseFormatted(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return (getDateHourClose() != null)? getDateHourClose().format(formatter): "";
    } 
}
