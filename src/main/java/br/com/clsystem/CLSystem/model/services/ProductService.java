package br.com.clsystem.CLSystem.model.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Product;
import br.com.clsystem.CLSystem.model.entities.record.ProductRecord;
import br.com.clsystem.CLSystem.model.repositories.ProductRepository;

@Service
public class ProductService {

	final ProductRepository productRepository;
	
	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}
	
	public ResponseEntity<?> save(ProductRecord productRecord){
		Product product = new Product();
		BeanUtils.copyProperties(productRecord, product);
		try {
		      return ResponseEntity.ok(productRepository.saveAndFlush(product));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> update(ProductRecord productRecord){
		Optional<Product> productUp = productRepository.findById(productRecord.idProduct());
		BeanUtils.copyProperties(productRecord, productUp.get());
		try {
			return ResponseEntity.ok().body(productRepository.saveAndFlush(productUp.get()));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}
	
	public List<ProductRecord> findAll(){
		try {
			List<ProductRecord> listProductRecord = new ArrayList<>(); 
			List<Product> listProduct = productRepository.findAll();
					listProduct.stream().forEach(product -> {
						        ProductRecord productRecord = new ProductRecord(product.getIdProduct(),
						        		                                        product.getNameProduct(),
						        		                                        product.getProductDescription(),
						        		                                        product.getValueCost(),
						        		                                        product.getValueSale(),
						        		                                        product.getBarCode());
								listProductRecord.add(productRecord);
								
							});
			return listProductRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
}
