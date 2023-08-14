package br.com.clsystem.CLSystem.model.repositories;

import java.util.Optional;

import org.springframework.boot.actuate.autoconfigure.health.HealthProperties.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.types.StatusCashier;

public interface CashierRepository extends JpaRepository<Cashier, Long> {
    Optional<Cashier> findByEmployeeAndStatus(Employee employee, StatusCashier status);
}
