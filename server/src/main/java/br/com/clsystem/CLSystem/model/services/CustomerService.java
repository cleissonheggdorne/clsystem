package br.com.clsystem.CLSystem.model.services;

import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.entities.record.CustomerRecord;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.CustomerRepository;
import br.com.clsystem.CLSystem.tools.MailService;
import br.com.clsystem.CLSystem.types.TypeToken;
import br.com.clsystem.CLSystem.types.TypeUser;
import jakarta.transaction.Transactional;

@Service
public class CustomerService {
    @Value("${app.base-url}")
    private String appBaseUrl;
    final CustomerRepository customerRepository;
    final EmployeeService employeeService;
    final VerificationTokenService verificationTokenService;
    final MailService mailService;
    private final MessageSource messageSource;

    public CustomerService(CustomerRepository customerRepository, EmployeeService employeeService,
     VerificationTokenService verificationTokenService, MailService mailService, MessageSource messageSource){
        this.customerRepository = customerRepository;
        this.employeeService = employeeService;
        this.verificationTokenService = verificationTokenService;
        this.mailService = mailService;
        this.messageSource = messageSource;
    }

    @Transactional
    public ResponseEntity<?> saveCustomerAndEmployee(CustomerRecord customeRecord) throws Exception{
        Customer customerNew = new Customer(UUID.randomUUID(), customeRecord.name(), customeRecord.document());
        customerNew = customerRepository.saveAndFlush(customerNew);
       
        EmployeeRecord employeeRecord = new EmployeeRecord(0L,
                                                        customerNew.getName(), 
                                                        customerNew.getDocument(), 
                                                        new Date(), 
                                                        customeRecord.password(), 
                                                        customeRecord.email(), 
                                                        customeRecord,
                                                        TypeUser.ADMIN);
        ResponseEntity<?> response = employeeService.save(employeeRecord, customerNew);
        Employee employee = (Employee) response.getBody();
        VerificationToken token = verificationTokenService.createVerificationToken(employee, TypeToken.VERIFICATION);
        String body = String.format(messageSource.getMessage("email.body.register", null, Locale.getDefault()), getUrlConfirmacao() + token.getToken() + "&confirmation=true");
        boolean sent =mailService.sendEmailHtml(token.getEmail(), messageSource.getMessage("email.subject.register", null, Locale.getDefault()), body);
        if(!sent){
            throw new Exception("Erro ao enviar email de confirmação. Por favor, tente novamente mais tarde.");
        }
        return ResponseEntity.ok(customerNew);
    }

    public String getUrlConfirmacao() {
        return appBaseUrl + "/#/login?token=";
    }

}
