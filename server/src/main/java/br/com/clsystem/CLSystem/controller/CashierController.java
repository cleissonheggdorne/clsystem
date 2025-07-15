package br.com.clsystem.CLSystem.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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
@RequestMapping("/api/cashier")
public class CashierController {

	final CashierService cashierService;
	
	public CashierController(CashierService cashierService) {
		this.cashierService = cashierService;
	}
	
	@PostMapping("/open")
	public ResponseEntity<?> saveController(@Valid @RequestBody CashierRecord cashierRecord, BindingResult br, Principal principal){
		return cashierService.openCashier(cashierRecord, principal.getName());
	}
	
	@PutMapping("/close")
	public ResponseEntity<?> closeCashier(@RequestBody Map<String, Long> idCashier, Principal principal){
		try {
			return cashierService.closeCashier(idCashier.get("idCashier"), principal.getName());
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

	@GetMapping("/summary-by-cashier")
	public ResponseEntity<?> resumeByCashier(@RequestParam(name = "idCashier") Long idCashierRequest){
		try { 
			//System.out.println(formPayment.get("formPayment"));
			return ResponseEntity.ok().body(cashierService.resumeByCashier((Long) idCashierRequest));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	// @GetMapping("/find-by-id")
	// public ResponseEntity<?> findByIdCashier(@RequestParam(name = "id") Long idCashier){
	// 	try {
	// 		return ResponseEntity.ok().body(cashierService.findById(idCashier));
	// 	}catch(DataBaseException e) {
	// 		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
	// 	}
	// }

	@GetMapping("/findall")
	public ResponseEntity<?> findByIdCashier(){
		try {
			return ResponseEntity.ok().body(cashierService.findHistorySummary());
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	@GetMapping("/find")
	public ResponseEntity<?> findByEmployeeName(@RequestParam(name = "key") String key){
		try {
			return ResponseEntity.ok().body(cashierService.findByEmployeeName(key));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
}
