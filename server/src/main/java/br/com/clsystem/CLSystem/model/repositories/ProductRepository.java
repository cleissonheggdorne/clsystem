package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.clsystem.CLSystem.model.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findByCustomerId(UUID	customeId);

	@Query("""
    SELECT e FROM Product e
    WHERE e.customer.id = :customerId
      AND (LOWER(e.nameProduct) LIKE LOWER(CONCAT('%', :value, '%'))
           OR LOWER(e.barCode) LIKE LOWER(CONCAT('%', :value, '%')))
	""")
	List<Product> findByNameProductOrBarCodeByCustomerId(@Param("value") String value, @Param("customerId") UUID customerId);
}
