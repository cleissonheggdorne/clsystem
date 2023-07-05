package br.com.clsystem.CLSystem.model.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
