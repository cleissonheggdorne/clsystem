package br.com.clsystem.CLSystem.model.services;

import java.util.Date;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.record.CustomerRecord;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.CustomerRepository;
import jakarta.transaction.Transactional;

@Service
public class CustomerService {

    final CustomerRepository customerRepository;
    final EmployeeService employeeService;

    public CustomerService(CustomerRepository customerRepository, EmployeeService employeeService){
        this.customerRepository = customerRepository;
        this.employeeService = employeeService;
    }

    @Transactional
    public ResponseEntity<?> saveCustomerAndEmployee(CustomerRecord customeRecord){
        Customer customerNew = new Customer(UUID.randomUUID(), customeRecord.name(), customeRecord.document());
       
        customerNew = customerRepository.save(customerNew);
        EmployeeRecord employeeRecord = new EmployeeRecord(0L,
                                                        customerNew.getName(), 
                                                        customerNew.getDocument(), 
                                                        new Date(), 
                                                        customeRecord.password(), 
                                                        customeRecord.email(), 
                                                        customeRecord);
        employeeService.save(employeeRecord, customerNew);
        return ResponseEntity.ok(customerNew);
    }
}
