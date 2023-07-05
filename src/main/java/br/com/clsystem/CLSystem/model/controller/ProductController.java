package br.com.clsystem.CLSystem.model.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.record.ProductRecord;
import br.com.clsystem.CLSystem.model.services.ProductService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins="*", maxAge = 3600) //Permitir ser acessado de Qualquer fonte
@RequestMapping("/api/product")
public class ProductController {

	final ProductService productService;
	
	public ProductController(ProductService productService) {
		this.productService = productService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody ProductRecord productRecord, BindingResult br){
		try {
			return productService.save(productRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody ProductRecord productRecord, BindingResult br){
		try {
			return productService.update(productRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/find")
	public ResponseEntity<?> findController(){
		try {
			return ResponseEntity.ok().body(productService.findAll());
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
