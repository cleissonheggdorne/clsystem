package br.com.clsystem.CLSystem.model.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;

@Service
public class EmployeeService {

	final EmployeeRepository employeeRepository;
	
	public EmployeeService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}
	
	public ResponseEntity<?> save(EmployeeRecord employeeRecord){
		Employee employee = new Employee();
		BeanUtils.copyProperties(employeeRecord, employee);
		try {
		      return ResponseEntity.ok(employeeRepository.saveAndFlush(employee));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> update(EmployeeRecord employeeRecord){
		Optional<Employee> employeeUp = employeeRepository.findById(employeeRecord.idEmployee());
		BeanUtils.copyProperties(employeeRecord, employeeUp.get());
		try {
			return ResponseEntity.ok().body(employeeRepository.saveAndFlush(employeeUp.get()));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}
	
	public List<EmployeeRecord> findAll(){
		try {
			List<EmployeeRecord> listEmployeeRecord = new ArrayList<>(); 
			List<Employee> listEmployee = employeeRepository.findAll();
					listEmployee.stream().forEach(employee -> {
						        EmployeeRecord employeeRecord = new EmployeeRecord(employee.getIdEmployee(),
						        		                                        employee.getNameEmployee(),
						        		                                        employee.getDocument(),
						        		                                        employee.getInitialDate());
								listEmployeeRecord.add(employeeRecord);
								
							});
			return listEmployeeRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public Optional<Employee> findById(Long id) {
		try {
			return employeeRepository.findById(id);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	

}
