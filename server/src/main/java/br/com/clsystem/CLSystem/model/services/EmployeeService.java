package br.com.clsystem.CLSystem.model.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;
import br.com.clsystem.CLSystem.types.TypeUser;

@Service
public class EmployeeService {

	final EmployeeRepository employeeRepository;
	final PasswordEncoder passwordEncoder;
	
	public EmployeeService(EmployeeRepository employeeRepository,
						PasswordEncoder passwordEncoder) {
		this.employeeRepository = employeeRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public ResponseEntity<?> save(EmployeeRecord employeeRecord, Customer customer){
		Employee employee = new Employee();

		if(employeeRecord.idEmployee() != null && employeeRecord.idEmployee() > 0) {
			return update(employeeRecord, customer);
		}
		Optional<Employee> employeeOptional = employeeRepository.findByDocumentAndDeletedAtIsNull(employeeRecord.document());
		if(employeeOptional.isPresent() && employeeOptional.get().getDeletedAt() == null){
			return ResponseEntity.badRequest().body("Funcionário em duplicidade. Não é possível ter o mesmo funcionário ativo em duas empresas diferentes.");
		}

		BeanUtils.copyProperties(employeeRecord, employee);
		employee.setPassword(passwordEncoder.encode(employee.getPassword()));
		employee.setCustomer(customer);
		Boolean admin = employeeRecord.typeUser().equals(TypeUser.ADMIN);
		employee.setEmailConfirmed(admin ? false : true);
		employee.setTypeUser(admin ? employeeRecord.typeUser() : TypeUser.EMPLOYEE);
		try {
			return ResponseEntity.ok(employeeRepository.saveAndFlush(employee));
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}
	
	public ResponseEntity<?> update(EmployeeRecord employeeRecord, Customer customer){
		Optional<Employee> employeeUp = employeeRepository.findById(employeeRecord.idEmployee());
		if(employeeUp.isEmpty() || !employeeUp.get().getCustomer().getId().equals(customer.getId())) {
			return ResponseEntity.notFound().build();
		}
		BeanUtils.copyProperties(employeeRecord, employeeUp.get());
		try {
			return ResponseEntity.ok().body(employeeRepository.saveAndFlush(employeeUp.get()));
		}catch(DataIntegrityViolationException dive) {
			throw new DataBaseException("", dive);
		}
	}

	public ResponseEntity<?> updatePassword(String passwordOld, String passwordNew, String document, UUID customerId){
		Optional<Employee> employeeUp = employeeRepository.findByDocumentAndDeletedAtIsNull(document);
		if(employeeUp.isEmpty() || !employeeUp.get().getCustomer().getId().equals(customerId)) {
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
	
	public List<Optional<EmployeeProjection>> find(Employee employee){
		List<Optional<EmployeeProjection>> listEmployee ;
		try{
			switch(employee.getTypeUser()){
				case ADMIN:
					listEmployee = employeeRepository.findByCustomerIdAndDeletedAtIsNull(employee.getCustomer().getId());
					break;
				case MANAGER:
					listEmployee = employeeRepository.findByCustomerIdAndDeletedAtIsNull(employee.getCustomer().getId());
					break;
				case EMPLOYEE:
					listEmployee = employeeRepository
						.findByIdEmployeeAndCustomerIdAndDeletedAtIsNull(employee.getIdEmployee(), employee.getCustomer().getId());
					break;
				default:
					listEmployee = List.of();
			}
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
		return listEmployee;
	}
	
	public Optional<Employee> findById(Long id) {
		try {
			return employeeRepository.findById(id);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public List<EmployeeRecord> findByNameEmployeeOrDocument(String search, UUID customerId){
		try {
			List<Employee> listEmployee = employeeRepository.findByCustomerIdAndNameOrDocument(customerId, search);
			return fillList(listEmployee);
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}

	public EmployeeProjection findByDocumentAndCustomerId(String document, UUID customerId){
		try {
			Optional<EmployeeProjection> employee = employeeRepository.findByDocumentAndCustomerIdAndDeletedAtIsNull(document, customerId);
			return employee.get();
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	public List<EmployeeRecord> fillList(List<Employee> listEmployee){
		try {
			List<EmployeeRecord> listEmployeeRecord = new ArrayList<>(); 
					listEmployee.stream().forEach(employee -> {
						        EmployeeRecord employeeRecord = new EmployeeRecord(employee.getIdEmployee(),
						        													employee.getNameEmployee(),
						        													employee.getDocument(),
						        		                                        employee.getInitialDate(),
																				employee.getPassword(),
																				employee.getEmail(),
																				null,
																				employee.getTypeUser());
						        listEmployeeRecord.add(employeeRecord);
								
							});
			return listEmployeeRecord;
		}catch(Exception e) {
			throw new DataBaseException("", e);
		}
	}
	
	
	public ResponseEntity<?> delete(Long id, UUID customerId){
		try {
			Optional<Employee> employee = employeeRepository.findById(id);
			if(employee.isEmpty() || !employee.get().getCustomer().getId().equals(customerId)) {
				return ResponseEntity.notFound().build();
			}
			employee.get().setDeletedAt(LocalDateTime.now());
			employeeRepository.save(employee.get());
			return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException dive) {		
			throw new DataBaseException("", dive);
		}
	}

	public Optional<Employee> findByEmail(String email) {
		try {
			return employeeRepository.findByEmailAndDeletedAtIsNull(email);
		}catch(Exception e) {
			throw new DataBaseException("Ocorreu um problema. Tente novamente mais tarde", e);
		}
	}

	public void updateEmployee(Employee employee) {
		try {
			employeeRepository.saveAndFlush(employee);
		}catch(Exception e) {
			throw new DataBaseException("Erro ao atualizar funcionário", e);
		}
	}

}
