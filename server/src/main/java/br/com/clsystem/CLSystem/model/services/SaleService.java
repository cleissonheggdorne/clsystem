package br.com.clsystem.CLSystem.model.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.SaleProjection;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import br.com.clsystem.CLSystem.types.FormPayment;
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
	
	public Sale openSale(Long idCashier){

		Sale sale = new Sale(); 
		sale.setDateHourEntry(LocalDateTime.now());
		System.out.println(sale.getDateHourEntry());
		sale.setIdCashier(cashierService.findById(idCashier).get());
		sale.setStatusSale(StatusSale.PENDENTE);
		sale.setFormPayment(FormPayment.PENDENTE);
		try {
			  Sale saleSaved = saleRepository.saveAndFlush(sale);
		      return saleSaved;//ResponseEntity.ok(saleSaved);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

	public ResponseEntity<?> closeSale(Map<String, Object> dataSale){

		Integer idCashierInt = (Integer) dataSale.get("idCashier");
		Long idCashier = Long.valueOf(idCashierInt);
		Optional<Cashier> cashier = cashierService.findById(idCashier);

		Integer idSaleInt = (Integer) dataSale.get("idSale");
		Long idSale = Long.valueOf(idSaleInt);
		Optional<Sale> sale = saleRepository.findByIdSaleAndIdCashierAndStatusSale(idSale, cashier.get(), StatusSale.PENDENTE);

		sale.get().setDateHourClose(LocalDateTime.now());
		sale.get().setStatusSale(StatusSale.FINALIZADA);
		sale.get().setFormPayment(FormPayment.valueOf((String) dataSale.get("formPayment")));
		try {
			  Sale saleSaved = saleRepository.saveAndFlush(sale.get());
		      return ResponseEntity.ok(saleSaved);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

	public Optional<Sale> findBySaleOpen(Long idCashier){
		return saleRepository.findByIdCashierIdCashierAndStatusSale(idCashier, StatusSale.valueOf("PENDENTE"));
	}
	
	public Optional<Sale> findById(Long id){
		try {
			
			return saleRepository.findById(id);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}

    public ResponseEntity<?> cancelSale(Map<String, Object> dataSale) {
        Integer idCashierInt = (Integer) dataSale.get("idCashier");
		Long idCashier = Long.valueOf(idCashierInt);
		Optional<Cashier> cashier = cashierService.findById(idCashier);

		Integer idSaleInt = (Integer) dataSale.get("idSale");
		Long idSale = Long.valueOf(idSaleInt);
		Optional<Sale> sale = saleRepository.findByIdSaleAndIdCashierAndStatusSale(idSale, cashier.get(), StatusSale.PENDENTE);

		sale.get().setDateHourClose(LocalDateTime.now());
		sale.get().setStatusSale(StatusSale.CANCELADA);
		try {
			  Sale saleCancel = saleRepository.saveAndFlush(sale.get()); 
		      return ResponseEntity.ok(saleCancel);
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
    }

	public List<SaleProjection> listItensBySale(Long idSale, Long idCashier) {
		try {
			Optional<Sale> sale = saleRepository.findById(idSale != null? idSale : 0);
			if(sale.isPresent()){
				return saleRepository.findByIdSaleAndIdCashierIdCashier(sale.get().getIdSale(), idCashier);
			}else{
				sale = findBySaleOpen(idCashier);
				if(sale.isPresent()){
					return saleRepository.findByIdSaleAndIdCashierIdCashier(sale.get().getIdSale(), idCashier);
				}
				return new ArrayList<>();
			}
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
}
