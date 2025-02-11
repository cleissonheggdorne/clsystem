package br.com.clsystem.CLSystem.controller;

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
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.record.ItemSaleRecord;
import br.com.clsystem.CLSystem.model.services.ItemSaleService;
import br.com.clsystem.CLSystem.model.services.SaleService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/itemsale")
public class ItemSaleController {

	final SaleService saleService;
	final ItemSaleService itemSaleService;
	
	public ItemSaleController(SaleService saleService, ItemSaleService itemSaleService) {
		this.saleService = saleService;
		this.itemSaleService = itemSaleService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody ItemSaleRecord itemSaleRecord, BindingResult br){
		try {
			 ItemSale itemSale =  itemSaleService.saveItem(itemSaleRecord);
			 return  ResponseEntity.ok().body(itemSale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@PutMapping("/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody ItemSaleRecord itemSaleRecord, BindingResult br){
		try {
			 ItemSale itemSale =  itemSaleService.updateItem(itemSaleRecord);
			 return  ResponseEntity.ok().body(itemSale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@GetMapping("/finditenssale")
	public ResponseEntity<?> findController(@RequestParam(name = "idSale") String idSaleRequest, @RequestParam(name = "idCashier") String idCashierRequest){
		System.out.println(idSaleRequest + " teste " + idCashierRequest);
		Long idSale = (idSaleRequest == "")? null : Long.valueOf(idSaleRequest);
		Long idCashier = Long.valueOf(idCashierRequest);
		try {
				return ResponseEntity.ok().body(itemSaleService.findItensSale(idSale, idCashier));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
