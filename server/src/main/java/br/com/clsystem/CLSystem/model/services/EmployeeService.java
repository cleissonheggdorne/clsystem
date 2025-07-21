package br.com.clsystem.CLSystem.model.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;

@Service
public class EmployeeService {

	final EmployeeRepository employeeRepository;
	final PasswordEncoder passwordEncoder;
	
	public EmployeeService(EmployeeRepository employeeRepository,
						PasswordEncoder passwordEncoder) {
		this.employeeRepository = employeeRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	public ResponseEntity<?> save(EmployeeRecord employeeRecord){
		Employee employee = new Employee();

		if(employeeRecord.idEmployee() != null && employeeRecord.idEmployee() > 0) {
			return update(employeeRecord);
		}

		BeanUtils.copyProperties(employeeRecord, employee);
		employee.setPassword(passwordEncoder.encode(employee.getPassword()));
		try {
		      return ResponseEntity.ok(employeeRepository.saveAndFlush(employee));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> update(EmployeeRecord employeeRecord){
		Optional<Employee> employeeUp = employeeRepository.findById(employeeRecord.idEmployee());
		if(employeeUp.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		BeanUtils.copyProperties(employeeRecord, employeeUp.get());
		try {
			return ResponseEntity.ok().body(employeeRepository.saveAndFlush(employeeUp.get()));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}

	public ResponseEntity<?> updatePassword(String passwordOld, String passwordNew, String document){
		Optional<Employee> employeeUp = employeeRepository.findByDocument(document);
		if(employeeUp.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		if(!passwordEncoder.matches(passwordOld, employeeUp.get().getPassword())) {
			return ResponseEntity.badRequest().body("Senha atual digitada não confere");
		}
		employeeUp.get().setPassword(passwordEncoder.encode(passwordNew));
		try {
			Employee employee = employeeRepository.saveAndFlush(employeeUp.get());
			return ResponseEntity.ok().body(employee.factoryEmployeeRecord(employee));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}
	
	public List<Optional<EmployeeProjection>> findAll(){
		try {
			List<EmployeeRecord> listEmployeeRecord = new ArrayList<>(); 
			List<Employee> listEmployee = employeeRepository.findAll();
					listEmployee.stream().forEach(employee -> {
						        EmployeeRecord employeeRecord = employee.factoryEmployeeRecord(employee);
								listEmployeeRecord.add(employeeRecord);
								
							});
			return employeeRepository.findByIdEmployeeIsNotNull();
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
	
	public List<EmployeeRecord> findByNameEmployeeOrDocument(String search){
		try {
			List<Employee> listEmployee = employeeRepository.findByNameEmployeeContainingIgnoreCaseOrDocumentContainingIgnoreCase(search, search);
			return fillList(listEmployee);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}

	public EmployeeProjection findByIdOrDocument(String idOrDocument){
		try {
			Optional<EmployeeProjection> employee = employeeRepository.findByIdEmployeeOrDocument(Long.valueOf(idOrDocument), idOrDocument);
			return employee.get();
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public List<EmployeeRecord> fillList(List<Employee> listEmployee){
		try {
			List<EmployeeRecord> listEmployeeRecord = new ArrayList<>(); 
			//List<Product> listProduct = productRepository.findAll();
					listEmployee.stream().forEach(employee -> {
						        EmployeeRecord employeeRecord = new EmployeeRecord(employee.getIdEmployee(),
						        													employee.getNameEmployee(),
						        													employee.getDocument(),
						        		                                        employee.getInitialDate(),
																				employee.getPassword());
						        listEmployeeRecord.add(employeeRecord);
								
							});
			return listEmployeeRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	
	public ResponseEntity<?> delete(Long id){
		try {
			  employeeRepository.deleteById(id);
		      return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

}
