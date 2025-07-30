package br.com.clsystem.CLSystem.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.annotation.CurrentCustomer;
import br.com.clsystem.CLSystem.model.entities.record.ProductRecord;
import br.com.clsystem.CLSystem.model.services.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/product")
public class ProductController {

	final ProductService productService;
	
	public ProductController(ProductService productService) {
		this.productService = productService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody ProductRecord productRecord, BindingResult br,
										@CurrentCustomer Customer customer){
		try {
			return productService.save(productRecord, customer);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody ProductRecord productRecord, BindingResult br, 
										@CurrentCustomer Customer customer){
		try {
			return productService.update(productRecord, customer);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteController(@RequestBody Map<String, Long> requestBody, @CurrentCustomer Customer customer){
		try {
			 productService.delete(requestBody.get("id"), customer);
			 return ResponseEntity.ok().build();
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/findall")
	public ResponseEntity<?> findAllController(@CurrentCustomer Customer customer){
		try {
			return ResponseEntity.ok().body(productService.findByCustomerId(customer));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/find")
	public ResponseEntity<?> findController(@RequestParam(name = "key") String key, @CurrentCustomer Customer customer){
		try {
			System.out.println(key);
			return ResponseEntity.ok().body(productService.findByNameProductOrBarCode(key, customer));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
