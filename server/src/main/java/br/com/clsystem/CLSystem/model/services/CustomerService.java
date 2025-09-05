package br.com.clsystem.CLSystem.model.services;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.VerificationToken;
import br.com.clsystem.CLSystem.model.entities.record.CustomerRecord;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.repositories.CustomerRepository;
import br.com.clsystem.CLSystem.tools.MailService;
import jakarta.transaction.Transactional;

@Service
public class CustomerService {

    final String ASSUNTO = "CLSystem - Confirmação de Cadastro";
    final String MENSAGEM = "Olá, estamos felizes em tê-lo conosco!<br> Você solicitou acesso ao Software CLSystem.<br> Confirme seu cadastro clicando no link abaixo: ";
    
    @Value("${url.frontend}")
    private String baseUrl;

    @Value("${url.frontend.dev}")
    private String baseUrlDev;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    final CustomerRepository customerRepository;
    final EmployeeService employeeService;
    final VerificationTokenService verificationTokenService;
    final MailService mailService;

    public CustomerService(CustomerRepository customerRepository, EmployeeService employeeService,
     VerificationTokenService verificationTokenService, MailService mailService){
        this.customerRepository = customerRepository;
        this.employeeService = employeeService;
        this.verificationTokenService = verificationTokenService;
        this.mailService = mailService;
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
        VerificationToken token = verificationTokenService.createVerificationToken(employeeRecord.email());
        String body = MENSAGEM +  getUrlConfirmacao() + token.getToken();
        mailService.sendEmail(token.getEmail(), ASSUNTO, body);
        return ResponseEntity.ok(customerNew);
    }

    public String getUrlConfirmacao() {
        return  (activeProfile.matches("dev|local") ? baseUrlDev : baseUrl)+ "/#/login?token=" ;
    }

}
