package br.com.clsystem.CLSystem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.SaleProjection;
import br.com.clsystem.CLSystem.model.services.ItemSaleService;
import br.com.clsystem.CLSystem.model.services.SaleService;

@RestController
@RequestMapping("/api/sale")
public class SaleController {

	final SaleService saleService;
	final ItemSaleService itemSaleService;
	
	public SaleController(SaleService saleService, ItemSaleService itemSaleService) {
		this.saleService = saleService;
		this.itemSaleService = itemSaleService;
	}
	
	@PostMapping("/openSale")
	public ResponseEntity<?> openSaleController(@RequestBody Map<String, Long> requestBody){
		try { 
			 System.out.println(requestBody.get("idCashier"));
			 Sale sale = saleService.openSale(requestBody.get("idCashier"));
			 return ResponseEntity.ok().body(sale);	
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@PutMapping("/closesale")
	public ResponseEntity<?> closeSaleController(@RequestBody Map<String, Object> dataSale){
		try { 
			//System.out.println(formPayment.get("formPayment"));
			return saleService.closeSale(dataSale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@PutMapping("/cancel-sale")
	public ResponseEntity<?> cancelSaleController(@RequestBody Map<String, Object> dataSale){
		try { 
			return saleService.cancelSale(dataSale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@GetMapping("/list-itens-by-sale")
	public ResponseEntity<?> listItensBySaleController(@RequestParam(name = "idSale") Long idSaleRequest, @RequestParam(name = "idCashier") Long idCashierRequest){
		try {
			List<SaleProjection> listSaleItems = saleService.listItensBySale(idSaleRequest, idCashierRequest);
			if(listSaleItems == null || listSaleItems.isEmpty()){
				return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.header("X-Sale-Status", "empty")
					.body(null);
			} else {
				return ResponseEntity.ok()
					.header("X-Sale-Count", String.valueOf(listSaleItems.size()))
					.body(listSaleItems);
			}
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
}
