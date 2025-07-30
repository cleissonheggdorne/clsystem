package br.com.clsystem.CLSystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.model.entities.projection.EmployeeProjection;
import br.com.clsystem.CLSystem.model.services.EmployeeService;
import br.com.clsystem.CLSystem.tools.AuthenticationService;
import br.com.clsystem.CLSystem.tools.UserAuthenticated;

@RestController
@RequestMapping("/api")
public class Login {
    
    private final AuthenticationService authenticationService;
    private final EmployeeService employeeService;

    public Login(AuthenticationService authenticationService,
    EmployeeService employeeService){
        this.authenticationService = authenticationService;
        this.employeeService = employeeService;
    }

    @PostMapping("/public/employee/authenticate")
    public ResponseEntity<?> authenticate(
        Authentication authentication) {
      String token = authenticationService.authenticate(authentication);
      Map<String, EmployeeProjection> response = new HashMap<>();
      UserAuthenticated userAuthenticated = (UserAuthenticated) authentication.getPrincipal();
      
      response.put(token, employeeService.findByIdOrDocument(userAuthenticated.getUsername()));
      return ResponseEntity.ok().body(response);
    }

  //   @PostMapping("/public/employee/register")
  //   public ResponseEntity<?> register(@Valid @RequestBody EmployeeRecord employeeRecord, BindingResult br){
	// 	try {
	// 		return employeeService.save(employeeRecord, null);
	// 	}catch(DataBaseException e) {
	// 		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
	// 	}
	// }
}
