package br.com.clsystem.CLSystem.model.repositories;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.projection.CashierProjection;
import br.com.clsystem.CLSystem.types.StatusCashier;

public interface CashierRepository extends JpaRepository<Cashier, Long> {
    Optional<CashierProjection> findByEmployeeAndStatus(Employee employee, StatusCashier status);
    List<Optional<CashierProjection>> findByIdCashierIsNotNull();
    List<Optional<CashierProjection>> findByEmployeeNameEmployeeContainingIgnoreCase(String nameEmployee);

}
