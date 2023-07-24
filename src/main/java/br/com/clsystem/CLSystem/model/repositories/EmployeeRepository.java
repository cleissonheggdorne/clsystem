package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	List<Employee> findByNameEmployeeContainingIgnoreCaseOrDocumentContainingIgnoreCase(String name, String document);
}
