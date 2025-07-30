package br.com.clsystem.CLSystem.model.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.CashierProjection;
import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;
import br.com.clsystem.CLSystem.model.entities.record.CashierRecord;
import br.com.clsystem.CLSystem.model.repositories.CashierRepository;
import br.com.clsystem.CLSystem.model.repositories.SaleRepository;
import br.com.clsystem.CLSystem.types.FormPayment;
import br.com.clsystem.CLSystem.types.StatusCashier;
import br.com.clsystem.CLSystem.types.StatusSale;

@Service
public class CashierService {

	final CashierRepository cashierRepository;
	final EmployeeService employeeService;
	final SaleRepository saleRepository;
	
	public CashierService(CashierRepository cashierRepository, EmployeeService employeeService,
	SaleRepository saleRepository) {
		this.cashierRepository = cashierRepository;
		this.employeeService = employeeService;
		this.saleRepository = saleRepository;
	}
	
	public ResponseEntity<?> openCashier(CashierRecord cashierRecord, String document, Customer customer) {
		EmployeeProjection currentEmployee = employeeService.findByIdOrDocument(document);
		if(currentEmployee == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Funcionário não encontrado");
		}

		Optional<CashierProjection> cashierOpened = findByEmployeeAndStatus(currentEmployee.getIdEmployee(), customer);
		Cashier cashier;
		if(!cashierOpened.isPresent()){
			cashier= new Cashier();
		}else{
			return ResponseEntity.ok(cashierOpened);
		}
		Optional<Employee> employee = employeeService.findById(currentEmployee.getIdEmployee());		
		BeanUtils.copyProperties(cashierRecord, cashier);
		
		cashier.setDateHourOpen(LocalDateTime.now());
		cashier.setStatus(StatusCashier.ABERTO);
		cashier.setEmployee(employee.get());
		
		try {
		    return ResponseEntity.ok(findByIdCashierAndStatus(cashierRepository.saveAndFlush(cashier).getIdCashier()));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public Optional<Cashier> findById(Long id) {
		return cashierRepository.findById(id);
	}

	public Optional<CashierProjection> findByEmployeeAndStatus(Long idEmployee, Customer customer) {
		Employee employee = employeeService.findById(idEmployee).orElseThrow(() -> new DataBaseException("Funcionário não encontrado"));
		if(!employee.getCustomer().getId().equals(customer.getId())) {
			throw new DataBaseException("Funcionário não encontrado");
		}
		return cashierRepository.findByEmployeeCustomerIdAndEmployeeAndStatus(customer.getId() ,employee, StatusCashier.ABERTO);
	}

	public Optional<CashierProjection> findByIdCashierAndStatus(Long idEmployee) {
		return cashierRepository.findByIdCashierAndStatus(idEmployee, StatusCashier.ABERTO);
	}

	public ResponseEntity<?> closeCashier(long id, String document, Customer customer) {
		Cashier cashier = cashierRepository.findById(id).orElseThrow(()-> new DataBaseException("Caixa não encontrado"));
		if(!cashier.getEmployee().getCustomer().getId().equals(customer.getId())) {
			throw new DataBaseException("Caixa não encontrado");
		}
		cashier.setStatus(StatusCashier.FECHADO);
		cashier.setDateHourClose(LocalDateTime.now());
		try {
		      return ResponseEntity.ok(cashierRepository.saveAndFlush(cashier));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

	public List<Optional<CashierProjection>> findHistorySummary(Customer customer){
		List<Optional<CashierProjection>> listCashier = cashierRepository.findByEmployeeCustomerId(customer.getId());
		return listCashier;
	}

	public List<Optional<CashierProjection>> findByEmployeeName(String nameEmployee, Customer customer){
		List<Optional<CashierProjection>> listCashier = cashierRepository.findByEmployeeCustomerIdAndEmployeeNameEmployeeContainingIgnoreCase(customer.getId(), nameEmployee);
		return listCashier;
	}	

	public List<Map<String, List<Map<String, BigDecimal>>>> resumeByCashier(Long idCashier, Customer customer) {
		Map<String, BigDecimal> amountSalesMap = new HashMap<>();
		Cashier cashier = findById(idCashier).orElseThrow(() -> new DataBaseException("Caixa não encontrado"));
		if(!cashier.getEmployee().getCustomer().getId().equals(customer.getId())) {
			throw new DataBaseException("Caixa não encontrado");
		}
		List<Sale> sales = saleRepository.findByIdCashierAndStatusSaleIsNot(cashier, StatusSale.CANCELADA);
		sales.forEach(sale -> {
		       sale.calculateAmount();
		 });

		Map<FormPayment, Long> countGroup = sales.stream() 
		    .collect((Collectors.groupingBy(Sale::getFormPayment,  Collectors.counting())));
		//Lista de vendas por forma de pagamento
		List<Map<String, BigDecimal>> listSalesByFormPayment = new ArrayList<>();
		Map<String, BigDecimal> salesByFormPayment = new HashMap<>();
		countGroup.forEach((formpayment, amount) -> {
			salesByFormPayment.put(formpayment.toString().replace("_", " "), BigDecimal.valueOf(amount));
		});
		listSalesByFormPayment.add(salesByFormPayment);


		List<Map<String, BigDecimal>> listAmountSalesByFormPayment = new ArrayList<>();
		Map<FormPayment, BigDecimal> amountGroup = sales.stream()
			.collect(Collectors.groupingBy(
				Sale::getFormPayment, 
				Collectors.mapping(Sale::getAmount, 
				Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
		
		//Lista de valor total por forma de pagamento
		Map<String, BigDecimal> amountByFormPayment = new HashMap<>();
		amountGroup.forEach((formpayment, amount)->{
			
			amountByFormPayment.put(formpayment.toString().replace("_", " "), amount);
		});
		listAmountSalesByFormPayment.add(amountByFormPayment);


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
