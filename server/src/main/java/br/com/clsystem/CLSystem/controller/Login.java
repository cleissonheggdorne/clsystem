package br.com.clsystem.CLSystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.exceptions.EmailNotVerifiedException;
import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;
import br.com.clsystem.CLSystem.model.entities.record.CustomerRecord;
import br.com.clsystem.CLSystem.model.services.CustomerService;
import br.com.clsystem.CLSystem.model.services.EmployeeService;
import br.com.clsystem.CLSystem.tools.AuthenticationService;
import br.com.clsystem.CLSystem.tools.MailService;
import br.com.clsystem.CLSystem.tools.UserAuthenticated;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class Login {
    
    private final AuthenticationService authenticationService;
    private final EmployeeService employeeService;
    private final CustomerService customerService;
    private final MailService mailService;

    public Login(AuthenticationService authenticationService,
        EmployeeService employeeService, CustomerService customerService, MailService mailService){
        this.authenticationService = authenticationService;
        this.employeeService = employeeService;
        this.customerService = customerService;
        this.mailService = mailService;
    }

    @PostMapping("/public/employee/authenticate")
    public ResponseEntity<?> authenticate(
        Authentication authentication) {
          if(authentication.getPrincipal() instanceof UserAuthenticated userAuthenticated && !userAuthenticated.emailIsConfirmed()){
              throw new EmailNotVerifiedException("Email não verificado. Por favor, verifique o link que enviamos na sua caixa de entrada ou spam.");
          }
          String token = authenticationService.authenticate(authentication);
          Map<String, EmployeeProjection> response = new HashMap<>();
          UserAuthenticated userAuthenticated = (UserAuthenticated) authentication.getPrincipal();
          response.put(token, employeeService.findByDocumentAndCustomerId(userAuthenticated.getUsername(), userAuthenticated.getCustomer().getId()));
          return ResponseEntity.ok().body(response);
    }

    @PostMapping("/public/employee/register")
    public ResponseEntity<?> register(@Valid @RequestBody CustomerRecord customerRecord, BindingResult br){
      try {
			  return customerService.saveCustomerAndEmployee(customerRecord);
      }catch(DataBaseException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
      }
	  }
}
