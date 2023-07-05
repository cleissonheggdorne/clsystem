package br.com.clsystem.CLSystem.model.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
