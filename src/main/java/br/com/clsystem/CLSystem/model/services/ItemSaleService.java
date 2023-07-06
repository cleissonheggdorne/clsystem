package br.com.clsystem.CLSystem.model.services;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.repositories.ItemSaleRepository;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import jakarta.transaction.Transactional;

@Service
public class ItemSaleService {

	final SaleRepository saleRepository;
	final ItemSaleRepository itemSaleRepository;
	
	public ItemSaleService(SaleRepository saleRepository, ItemSaleRepository itemSaleRepository) {
		this.saleRepository = saleRepository;
		this.itemSaleRepository = itemSaleRepository;
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
