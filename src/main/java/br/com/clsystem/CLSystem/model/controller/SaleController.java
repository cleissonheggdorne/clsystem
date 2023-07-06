package br.com.clsystem.CLSystem.model.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.record.SaleRecord;
import br.com.clsystem.CLSystem.model.services.ItemSaleService;
import br.com.clsystem.CLSystem.model.services.SaleService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins="*", maxAge = 3600) //Permitir ser acessado de Qualquer fonte
@RequestMapping("/api/sale")
public class SaleController {

	final SaleService saleService;
	final ItemSaleService itemSaleService;
	
	public SaleController(SaleService saleService, ItemSaleService itemSaleService) {
		this.saleService = saleService;
		this.itemSaleService = itemSaleService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody SaleRecord sale, BindingResult br){
		try {
			 return saleService.save(sale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
