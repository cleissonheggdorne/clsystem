package br.com.clsystem.CLSystem.model.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.types.StatusSale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findByIdCashierIdCashierAndStatusSale(Long id, StatusSale status);
}
