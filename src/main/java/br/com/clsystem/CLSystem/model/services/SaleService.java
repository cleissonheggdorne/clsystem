package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.SaleProjection;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import br.com.clsystem.CLSystem.types.FormPayment;
import br.com.clsystem.CLSystem.types.StatusSale;
import scala.Array;

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

	public List<Map<String, List<Map<String, BigDecimal>>>> resumeByCashier(Long idCashier){
		Map<String, BigDecimal> amountSalesMap = new HashMap<>();

		List<Sale> sales = saleRepository.findByIdCashier(cashierService.findById(idCashier).get());
		sales.forEach(sale -> {
		       sale.calculateAmount();
		 });
		//Map<String, BigDecimal> countSales = new HashMap<>(); 
		//countSales.put("Quantidade de Vendas",  BigDecimal.valueOf(Integer.valueOf(sales.size())));
		
		Map<FormPayment, Long> countGroup = sales.stream() 
		    .collect((Collectors.groupingBy(Sale::getFormPayment,  Collectors.counting())));
		//Lista de vendas por forma de pagamento
		List<Map<String, BigDecimal>> listSalesByFormPayment = new ArrayList<>();
		countGroup.forEach((formpayment, amount) -> {
			Map<String, BigDecimal> salesByFormPayment = new HashMap<>();
			salesByFormPayment.put(formpayment.toString(), BigDecimal.valueOf(amount));
			listSalesByFormPayment.add(salesByFormPayment);
		});

		List<Map<String, BigDecimal>> listAmountSalesByFormPayment = new ArrayList<>();
		Map<FormPayment, BigDecimal> amountGroup = sales.stream()
			.collect(Collectors.groupingBy(
				Sale::getFormPayment, 
				Collectors.mapping(Sale::getAmount, 
				Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
		
		//Lista de valor total por forma de pagamento
		amountGroup.forEach((formpayment, amount)->{
			Map<String, BigDecimal> salesByFormPayment = new HashMap<>();
			salesByFormPayment.put(formpayment.toString(), amount);
			listAmountSalesByFormPayment.add(salesByFormPayment);
		});

		BigDecimal amountSales = sales.stream().map(Sale::getAmount)
		    .reduce(new BigDecimal(0.0), BigDecimal::add);
        
		//Resumo geral
		List<Map<String, BigDecimal>> listResumeSales = new ArrayList<>();
		amountSalesMap.put("Total de Vendas", amountSales);
		amountSalesMap.put("Quantidade de vendas", BigDecimal.valueOf(Integer.valueOf(sales.size())));
        listResumeSales.add(amountSalesMap);

	    List<Map<String, List<Map<String, BigDecimal>>>> retorno = new ArrayList<>();
		
		Map<String, List<Map<String,BigDecimal>>> a = new HashMap<>();
		a.put("Quantidade", listSalesByFormPayment);
		
		Map<String, List<Map<String,BigDecimal>>> b = new HashMap<>();
		b.put("Valor", listAmountSalesByFormPayment);

		Map<String, List<Map<String,BigDecimal>>> c = new HashMap<>();
		c.put("Resumo", listResumeSales);

		retorno.add(a);
		retorno.add(b);
		retorno.add(c);
		return retorno;
	}

}
