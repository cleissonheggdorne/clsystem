package br.com.clsystem.CLSystem.controller;

import java.security.Principal;
import java.util.List;
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
import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.annotation.CurrentCustomer;
import br.com.clsystem.CLSystem.model.entities.projection.ItemSaleProjection;
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
	public ResponseEntity<?> saveController(@Valid @RequestBody ItemSaleRecord itemSaleRecord, BindingResult br, Principal principal, @CurrentCustomer Customer customer){
		//try {
			 ItemSaleProjection itemSale =  itemSaleService.saveItem(itemSaleRecord, principal.getName(), customer);
			 return  ResponseEntity.ok().body(itemSale);
		//}catch(DataBaseException e) {
		//	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		//}
	}

	@PutMapping("/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody ItemSaleRecord itemSaleRecord, BindingResult br){
		try {
			ItemSaleProjection itemSale =  itemSaleService.updateItem(itemSaleRecord);
			 return  ResponseEntity.ok().body(itemSale);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/delete")
	public ResponseEntity<?> deleteController(@Valid @RequestBody ItemSaleRecord itemSaleRecord, BindingResult br) {
	    try {
	        itemSaleService.deleteItem(itemSaleRecord);
	        return ResponseEntity.ok().body(Map.of("Mensagem","Item de venda deletado com sucesso"));
	    } catch (DataBaseException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
	    }
	}

	@GetMapping("/finditenssale")
	public ResponseEntity<?> findController(@RequestParam(name = "idSale") String idSaleRequest, @RequestParam(name = "idCashier") String idCashierRequest){
		System.out.println(idSaleRequest + " teste " + idCashierRequest);
		try {
			Long idSale = Long.valueOf(idSaleRequest);
			Long idCashier = Long.valueOf(idCashierRequest);
			
			List<ItemSaleProjection> listItensSale = itemSaleService.findItensSale(idSale, idCashier);
			
			if(listItensSale.isEmpty()){
				return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.header("X-Sale-Status", "empty")
					.body(null);
			} else {
				return ResponseEntity.ok()
					.header("X-Sale-Count", String.valueOf(listItensSale.size()))
					.body(listItensSale);
			}
		} catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		} catch(NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("error", "Formato inválido para idSale ou idCashier"));
		}
	}
	
}
