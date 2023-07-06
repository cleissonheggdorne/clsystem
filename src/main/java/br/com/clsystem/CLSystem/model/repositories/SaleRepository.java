package br.com.clsystem.CLSystem.model.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {

}
