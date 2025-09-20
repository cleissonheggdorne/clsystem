package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.Product;
import br.com.clsystem.CLSystem.model.entities.record.ProductRecord;
import br.com.clsystem.CLSystem.model.repositories.ProductRepository;

@Service
public class ProductService {

	final ProductRepository productRepository;
	
	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}
	
	public ResponseEntity<?> save(ProductRecord productRecord, Customer customer){
		Product product = new Product();

		if(productRecord.idProduct() > 0) {
			return update(productRecord, customer);
		}

		BeanUtils.copyProperties(productRecord, product);
		product.setCustomer(customer);
		try {
		      return ResponseEntity.ok(productRepository.saveAndFlush(product));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> delete(Long id, Customer customer){
		try {
			Product product = productRepository.findById(id).orElseThrow(() -> new DataBaseException("Produto Não Encontrado"));
			if(!product.getCustomer().getId().equals(customer.getId())) {
				throw new DataBaseException("Produto Não Pertence ao Cliente");
			}
			product.setDeletedAt(LocalDateTime.now());
			productRepository.save(product);
			return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> update(ProductRecord productRecord, Customer customer){
		Product productUp = productRepository.findById(productRecord.idProduct())
			.orElseThrow(() -> new DataBaseException("Produto Não Encontrado"));
		
		if(!productUp.getCustomer().getId().equals(customer.getId())) {
			throw new DataBaseException("Produto Não Pertence ao Cliente");
		}
		BeanUtils.copyProperties(productRecord, productUp);
		try {
			return ResponseEntity.ok().body(productRepository.saveAndFlush(productUp));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}
	
	public List<ProductRecord> findByNameProductOrBarCode(String search, Customer customer){
		try {
			List<Product> listProduct = productRepository.findByNameProductOrBarCodeByCustomerId(search, customer.getId());
			return fillList(listProduct);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public Optional<Product> findById(Long id){
		try {
			return productRepository.findById(id);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public List<ProductRecord> findByCustomerId(Customer customer){
		try {
			List<Product> listProduct = productRepository.findByCustomerIdAndDeletedAtIsNull(customer.getId());
			return fillList(listProduct); 

//					listProduct.stream().forEach(product -> {
//						        ProductRecord productRecord = new ProductRecord(product.getIdProduct(),
//						        		                                        product.getNameProduct(),
//						        		                                        product.getProductDescription(),
//						        		                                        product.getValueCost(),
//						        		                                        product.getValueSale(),
//						        		                                        product.getBarCode());
//								listProductRecord.add(productRecord);
//								
//							});
		//	return listProductRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}

	public BigDecimal findValueProduct(Long idProduct){
		return findById(idProduct).get().getValueSale();
	}
	
	public List<ProductRecord> fillList(List<Product> listProduct){
		try {
			List<ProductRecord> listProductRecord = new ArrayList<>(); 
			//List<Product> listProduct = productRepository.findAll();
					listProduct.stream().forEach(product -> {
						        ProductRecord productRecord = new ProductRecord(product.getIdProduct(),
						        		                                        product.getNameProduct(),
						        		                                        product.getProductDescription(),
						        		                                        product.getValueSale(),
						        		                                        product.getValueCost(),
						        		                                        product.getBarCode());
								listProductRecord.add(productRecord);
								
							});
			return listProductRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
}
