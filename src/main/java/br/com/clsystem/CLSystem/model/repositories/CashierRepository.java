package br.com.clsystem.CLSystem.model.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Cashier;

public interface CashierRepository extends JpaRepository<Cashier, Long> {

}
