package br.com.clsystem.CLSystem.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@PostMapping("/open")
	public ResponseEntity<?> saveController(@Valid @RequestBody CashierRecord cashierRecord, BindingResult br){
		try {
			return cashierService.openCashier(cashierRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/close")
	public ResponseEntity<?> closeCashier(@RequestBody Map<String, Long> idCashier){
		try {
			return cashierService.closeCashier(idCashier.get("idCashier"));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@GetMapping("/find-open")
	public ResponseEntity<?> findOpenCashier(@RequestParam(name = "id") Long idEmployee){
		try {
			return ResponseEntity.ok().body(cashierService.findByEmployeeAndStatus(idEmployee));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
