package br.com.clsystem.CLSystem.model.entities.projection;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import br.com.clsystem.CLSystem.types.StatusCashier;

public interface CashierProjection {
    Long getIdCashier();
    LocalDateTime getdateHourOpen();
    StatusCashier getStatus();

    default String getDateHourOpenFormatted(){
         // Define um formato desejado (pode personalizar conforme necessário)
         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

         // Formata a data e hora usando o formato especificado
         return getdateHourOpen().format(formatter);
    } 
}
