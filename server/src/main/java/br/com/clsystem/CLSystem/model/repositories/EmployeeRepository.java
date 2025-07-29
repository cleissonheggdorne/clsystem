package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	List<Employee> findByNameEmployeeContainingIgnoreCaseOrDocumentContainingIgnoreCase(String name, String document);
	Optional<EmployeeProjection> findByIdEmployeeOrDocument(Long id, String document);
	List<Optional<EmployeeProjection>> findByIdEmployeeIsNotNull();
	Optional<Employee> findByDocument(String document);
	List<Optional<EmployeeProjection>> findByCustomerId(UUID id);
	
	@Query("""
    SELECT e FROM Employee e
    WHERE e.customer.id = :customerId
      AND (LOWER(e.nameEmployee) LIKE LOWER(CONCAT('%', :value, '%'))
           OR LOWER(e.document) LIKE LOWER(CONCAT('%', :value, '%')))
	""")
	List<Employee> findByCustomerIdAndNameOrDocument(@Param("customerId") UUID customerId,
                                                 @Param("value") String value);
}
