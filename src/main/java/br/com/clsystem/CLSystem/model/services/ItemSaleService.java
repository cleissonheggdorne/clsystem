package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.Product;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.ItemSaleProjection;
import br.com.clsystem.CLSystem.model.entities.projection.SaleProjection;
import br.com.clsystem.CLSystem.model.entities.record.ItemSaleRecord;
import br.com.clsystem.CLSystem.model.repositories.ItemSaleRepository;
import jakarta.transaction.Transactional;

@Service
public class ItemSaleService {

	final ItemSaleRepository itemSaleRepository;
	final ProductService productService;
	final SaleService saleService;
	final CashierService cashierService;
	
	public ItemSaleService(ItemSaleRepository itemSaleRepository,
			ProductService productService, SaleService saleService,
			CashierService cashierService) {
		this.itemSaleRepository = itemSaleRepository;
		this.productService = productService;
		this.saleService = saleService;
		this.cashierService = cashierService;
	}
	
	@Transactional
	public ItemSale saveItem(ItemSaleRecord itemSaleRecord){
		BigDecimal amount = new BigDecimal(0.0);
		Integer quantity;
		Optional<Sale> sale = saleService.findBySaleOpen(itemSaleRecord.idCashier());
		//Sale Open 
		if(!sale.isPresent()){
			sale = Optional.of(saleService.openSale(itemSaleRecord.idCashier()));
		}

		BigDecimal valueUnitary = productService.findValueProduct(itemSaleRecord.idProduct());
		Optional<Product> product = productService.findById(itemSaleRecord.idProduct());
		Optional<ItemSale> itemSale = findItemInSale(product.get(), sale.get());
		
		//ItemSale itemSale;
		//Sale item existis
		if(itemSale.isPresent()){	
			quantity = itemSale.get().getQuantity()+itemSaleRecord.quantity();
			amount = valueUnitary.multiply(BigDecimal.valueOf(quantity));
		}else{
			quantity = itemSaleRecord.quantity();
			amount = valueUnitary.multiply(BigDecimal.valueOf(quantity));
			itemSale = Optional.of(new ItemSale());
		}


		BeanUtils.copyProperties(itemSaleRecord, itemSale);
        itemSale.get().setAmount(amount);
		itemSale.get().setQuantity(quantity);
		itemSale.get().setIdSale(sale.get());
		itemSale.get().setUnitaryValue(valueUnitary);
		itemSale.get().setIdProduct(product.get()); 
		itemSale.get().setIdSale(sale.get());
		try {
			ItemSale itemSaleSaved = itemSaleRepository.saveAndFlush(itemSale.get());
			System.out.println(itemSaleSaved.getIdItemSale());
			return itemSaleSaved;
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

	@Transactional
	public ItemSale updateItem(ItemSaleRecord itemSaleRecord){
		BigDecimal amount = new BigDecimal(0.0);
		Integer quantity;
		
		Optional<ItemSale> itemSale = itemSaleRepository.findById(itemSaleRecord.idItemSale());
		BigDecimal valueUnitary = productService.findValueProduct(itemSale.get().getIdProduct().getIdProduct());
	
		quantity = itemSaleRecord.quantity();
		amount = valueUnitary.multiply(BigDecimal.valueOf(quantity));

		itemSale.get().setQuantity(itemSaleRecord.quantity());
		itemSale.get().setAmount(amount);
		

		try {
			ItemSale itemSaleSaved = itemSaleRepository.saveAndFlush(itemSale.get());
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

	// public List<ItemSaleProjection> findItensSale(Long idCashier){
		
	// 	List<ItemSaleProjection> listItensSale = new ArrayList<>();
		
	// 	Optional<Sale> sale = saleService.findBySaleOpen(idCashier);
	// 	listItensSale = itemSaleRepository.findByIdSale(sale.get()); //itemSaleRepository.findByIdSaleStatusSaleAndIdSaleIdCashier(StatusSale.PENDENTE, cashier.get());
	// 	return listItensSale;
		
	// }
	@Transactional	
	public List<ItemSaleProjection> findItensSale(Long idSale, Long idCashier){
		
		List<ItemSaleProjection> listItensSale = new ArrayList<>();
		try{
			if(idSale != null){
				Optional<Sale> sale = saleService.findById(idSale);
				listItensSale = itemSaleRepository.findByIdSale(sale.get());
				return listItensSale;
			}else{
				Optional<Sale> sale = saleService.findBySaleOpen(idCashier);
				if(sale.isPresent()){
					sale.get().calculateAmount();
					listItensSale = itemSaleRepository.findByIdSale(sale.get()); //itemSaleRepository.findByIdSaleStatusSaleAndIdSaleIdCashier(StatusSale.PENDENTE, cashier.get());
				}
				//Map<String, BigDecimal> slaes = saleService.resumeByCashier(idCashier);
				return listItensSale;
			}
		}catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
		
	}

	public Optional<ItemSale> findItemInSale(Product product, Sale sale){
		try{
			
			//Optional<Sale> sale = saleService.findById(sale);
			Optional<ItemSale> itemSale = itemSaleRepository.findByIdProductAndIdSale(product, sale);
			return itemSale;
		}catch(Exception e){
			throw new DataBaseException("", e);
		}
	}
}
