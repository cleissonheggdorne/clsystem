package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	List<Product> findByNameProductContainingIgnoreCaseOrBarCodeContainingIgnoreCase(String nameProduct, String barcode);
}
