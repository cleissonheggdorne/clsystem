package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.ItemSaleProjection;
import br.com.clsystem.CLSystem.model.entities.record.ItemSaleRecord;
import br.com.clsystem.CLSystem.model.repositories.ItemSaleRepository;
import br.com.clsystem.CLSystem.types.StatusSale;
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
	public ItemSale saveItem(ItemSaleRecord itemSaleRecord){
		  ItemSale itemSale = new ItemSale();
		  BeanUtils.copyProperties(itemSaleRecord, itemSale);
		 
		  Optional<Sale> sale = saleService.findBySaleOpen(itemSaleRecord.idCashier());
		  if(!sale.isPresent()){
			sale = Optional.of(saleService.openSale(itemSaleRecord.idCashier()));
		  }
		  //Optional<Sale> sale = saleService.findById(itemSaleRecord.idSale());
		  BigDecimal valueUnitary = productService.findValueProduct(itemSaleRecord.idProduct());
		  
		  itemSale.setIdSale(sale.get());
		  itemSale.setUnitaryValue(valueUnitary); 
		  itemSale.setAmount(valueUnitary
		                    .multiply(BigDecimal.valueOf(itemSaleRecord.quantity())));
		  itemSale.setIdProduct(productService.findById(itemSaleRecord.idProduct()).get());
		  itemSale.setIdSale(sale.get());
		try {
			  ItemSale itemSaleSaved = itemSaleRepository.saveAndFlush(itemSale);
			  System.out.println(itemSaleSaved.getIdItemSale());
		      return itemSaleSaved;
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

	public List<ItemSaleProjection> findItensSale(Long idSale){
		if(idSale != null){
			Optional<Sale> sale = saleService.findById(idSale);
			return itemSaleRepository.findByIdSale(sale.get());
		}else{
			return itemSaleRepository.findByIdSaleStatusSale(StatusSale.PENDENTE);
		}
	}

	
}
