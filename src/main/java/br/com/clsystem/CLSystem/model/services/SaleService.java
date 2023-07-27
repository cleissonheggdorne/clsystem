package br.com.clsystem.CLSystem.model.services;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.record.SaleRecord;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import br.com.clsystem.CLSystem.types.StatusSale;

@Service
public class SaleService {

	final SaleRepository saleRepository;
	final CashierService cashierService;
	
	public SaleService(SaleRepository saleRepository,
			CashierService cashierService) {
		this.saleRepository = saleRepository;
		this.cashierService = cashierService;
	}
	
	public ResponseEntity<?> save(SaleRecord saleRecord){
		Sale sale = new Sale();
		BeanUtils.copyProperties(saleRecord, sale);
		sale.setIdCashier(cashierService.findById(saleRecord.idCashier()).get());
		sale.setStatusSale(StatusSale.PENDENTE);
		//List<ItemSale> listItens = new ArrayList<>();
		try {
			  Sale saleSaved = saleRepository.saveAndFlush(sale);
//			  saleRecord.listItens().stream().forEach(item ->{
//				  ItemSale itemSale = new ItemSale();
//				  BeanUtils.copyProperties(item, itemSale);
//				  itemSale.setIdSale(saleSaved);
//				  itemSale.setAmount(item.unitaryValue().multiply(BigDecimal.valueOf(item.quantity())));
//				  itemSale.setIdProduct(productService.findById(item.idProduct()).get());
//				  listItens.add(itemSale);
//			  });
//			  itemSaleService.saveAll(listItens);
		      return ResponseEntity.ok(saleSaved);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public Optional<Sale> findById(Long id){
		try {
			return saleRepository.findById(id);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
}
