package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.projection.CashierProjection;
import br.com.clsystem.CLSystem.types.StatusCashier;

public interface CashierRepository extends JpaRepository<Cashier, Long> {
    Optional<CashierProjection> findByEmployeeCustomerIdAndEmployeeAndStatus(UUID customerId,Employee employee, StatusCashier status);
    Optional<CashierProjection> findByIdCashierAndStatus(Long id, StatusCashier status);
    List<Optional<CashierProjection>> findByEmployeeCustomerId(UUID customerId);
    List<Optional<CashierProjection>> findByEmployeeCustomerIdAndEmployeeNameEmployeeContainingIgnoreCase(UUID customerId, String nameEmployee);

}
