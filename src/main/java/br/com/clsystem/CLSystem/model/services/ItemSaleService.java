package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.record.ItemSaleRecord;
import br.com.clsystem.CLSystem.model.repositories.ItemSaleRepository;
import jakarta.transaction.Transactional;

@Service
public class ItemSaleService {

	final ItemSaleRepository itemSaleRepository;
	final ProductService productService;
	final SaleService saleService;
	
	public ItemSaleService(ItemSaleRepository itemSaleRepository,
			ProductService productService, SaleService saleService) {
		this.itemSaleRepository = itemSaleRepository;
		this.productService = productService;
		this.saleService = saleService;
	}
	
	@Transactional
	public ResponseEntity<?> saveItem(ItemSaleRecord itemSaleRecord){
		  ItemSale itemSale = new ItemSale();
		  BeanUtils.copyProperties(itemSaleRecord, itemSale);
		  itemSale.setAmount(itemSaleRecord.unitaryValue().multiply(BigDecimal.valueOf(itemSaleRecord.quantity())));
		  itemSale.setIdProduct(productService.findById(itemSaleRecord.idProduct()).get());
		  itemSale.setIdSale(saleService.findById(itemSaleRecord.idSale()).get());
		try {
			  ItemSale itemSaleSaved = itemSaleRepository.saveAndFlush(itemSale);
			  System.out.println(itemSaleSaved.getIdItemSale());
		      return ResponseEntity.ok(itemSaleSaved);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	@Transactional
	public List<ItemSale> saveAll(List<ItemSale> listItens){
		try {
		      return itemSaleRepository.saveAllAndFlush(listItens);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
}
