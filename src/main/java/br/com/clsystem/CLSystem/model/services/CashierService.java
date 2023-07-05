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
	
	public ResponseEntity<?> save(CashierRecord cashierRecord){
		Cashier cashier = new Cashier();
		Optional<Employee> employee = employeeService.findById(cashierRecord.idEmployee());
		BeanUtils.copyProperties(cashierRecord, cashier);
		cashier.setEmployee(employee.get());
		try {
		      return ResponseEntity.ok(cashierRepository.saveAndFlush(cashier));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> updateStatus(long id){
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
