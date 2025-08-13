package br.com.clsystem.CLSystem.model.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, UUID>{

}
