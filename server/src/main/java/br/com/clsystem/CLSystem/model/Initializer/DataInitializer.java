package br.com.clsystem.CLSystem.model.Initializer;



import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;
import jakarta.transaction.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository; 
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        
        if (!employeeRepository.findById(1L).isPresent()){        
         
            Employee employee = new Employee();
            employee.setNameEmployee("ADMIN GERAL");
            employee.setDocument("12345678912");
            employee.setInitialDate(new Date());
	        employee.setPassword(passwordEncoder.encode("123456"));
            try {
                employeeRepository.save(employee);
            } catch (DataIntegrityViolationException dive) {		
                throw new DataBaseException("", dive);
            }
        }
    }
}