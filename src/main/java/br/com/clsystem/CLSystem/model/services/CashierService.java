package br.com.clsystem.CLSystem.model.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.record.CashierRecord;
import br.com.clsystem.CLSystem.model.repositories.CashierRepository;
import br.com.clsystem.CLSystem.types.StatusCashier;

@Service
public class CashierService {

	final CashierRepository cashierRepository;
	final EmployeeService employeeService;
	
	public CashierService(CashierRepository cashierRepository, EmployeeService employeeService) {
		this.cashierRepository = cashierRepository;
		this.employeeService = employeeService;
	}
	
	public ResponseEntity<?> openCashier(CashierRecord cashierRecord){
		Optional<Cashier> cashierOpened = findByEmployeeAndStatus(cashierRecord.idEmployee());
		Cashier cashier;
		if(!cashierOpened.isPresent()){
			cashier= new Cashier();
		}else{
			return ResponseEntity.ok(cashierOpened);
		}
		Optional<Employee> employee = employeeService.findById(cashierRecord.idEmployee());		
		BeanUtils.copyProperties(cashierRecord, cashier);
		
		cashier.setDateHourOpen(LocalDateTime.now());
		cashier.setStatus(StatusCashier.ABERTO);
		cashier.setEmployee(employee.get());
		try {
		      return ResponseEntity.ok(cashierRepository.saveAndFlush(cashier));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public Optional<Cashier> findById(Long id) {
		return cashierRepository.findById(id);
	}

	public Optional<Cashier> findByEmployeeAndStatus(Long idEmployee) {
		Optional<Employee> employee = employeeService.findById(idEmployee);
		return cashierRepository.findByEmployeeAndStatus(employee.get(), StatusCashier.ABERTO);
	}

	public ResponseEntity<?> closeCashier(long id){
		Optional<Cashier> cashier = cashierRepository.findById(id);
		cashier.get().setStatus(StatusCashier.FECHADO);
		cashier.get().setDateHourClose(LocalDateTime.now());
		try {
		      return ResponseEntity.ok(cashierRepository.saveAndFlush(cashier.get()));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
}
