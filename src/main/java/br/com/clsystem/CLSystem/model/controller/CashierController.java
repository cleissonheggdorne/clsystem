package br.com.clsystem.CLSystem.model.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.record.CashierRecord;
import br.com.clsystem.CLSystem.model.services.CashierService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins="*", maxAge = 3600) //Permitir ser acessado de Qualquer fonte
@RequestMapping("/api/cashier")
public class CashierController {

	final CashierService cashierService;
	
	public CashierController(CashierService cashierService) {
		this.cashierService = cashierService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody CashierRecord cashierRecord, BindingResult br){
		try {
			return cashierService.save(cashierRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/update-status/{id}")
	public ResponseEntity<?> statusController(@PathVariable Long id){
		try {
			return cashierService.updateStatus(id);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
