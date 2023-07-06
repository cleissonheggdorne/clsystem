package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.record.SaleRecord;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import jakarta.transaction.Transactional;

@Service
public class SaleService {

	final SaleRepository saleRepository;
	final CashierService cashierService;
	final ItemSaleService itemSaleService;
	final ProductService productService;
	
	public SaleService(SaleRepository saleRepository,
			CashierService cashierService,
			ItemSaleService itemSaleService,
			ProductService productService) {
		this.saleRepository = saleRepository;
		this.cashierService = cashierService;
		this.itemSaleService = itemSaleService;
		this.productService = productService;
	}
	
	@Transactional
	public ResponseEntity<?> save(SaleRecord saleRecord){
		Sale sale = new Sale();
		BeanUtils.copyProperties(saleRecord, sale);
		sale.setIdCashier(cashierService.findById(saleRecord.idCashier()).get());
		List<ItemSale> listItens = new ArrayList<>();
		try {
			  Sale saleSaved = saleRepository.saveAndFlush(sale);
			  saleRecord.listItens().stream().forEach(item ->{
				  ItemSale itemSale = new ItemSale();
				  BeanUtils.copyProperties(item, itemSale);
				  itemSale.setIdSale(saleSaved);
				  itemSale.setAmount(item.unitaryValue().multiply(BigDecimal.valueOf(item.quantity())));
				  itemSale.setIdProduct(productService.findById(item.idProduct()).get());
				  listItens.add(itemSale);
			  });
			  itemSaleService.saveAll(listItens);
		      return ResponseEntity.ok(saleSaved);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
}
