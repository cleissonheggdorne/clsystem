package br.com.clsystem.CLSystem.model.entities.projection;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public interface EmployeeProjection {
    Long getIdEmployee();
    String getNameEmployee();
    String getdocument();
    String getEmail();
    @JsonFormat(pattern = "dd/MM/yyyy")
    Date getInitialDate();
    String getTypeUser();
}
