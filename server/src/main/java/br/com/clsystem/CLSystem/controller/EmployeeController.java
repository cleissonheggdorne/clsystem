package br.com.clsystem.CLSystem.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.clsystem.CLSystem.exceptions.DataBaseException;
import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import br.com.clsystem.CLSystem.model.services.EmployeeService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api")
public class EmployeeController {

	final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}
	
	@PostMapping("/employee/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody EmployeeRecord employeeRecord, BindingResult br){
		try {
			return employeeService.save(employeeRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/employee/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody EmployeeRecord employeeRecord, BindingResult br){
		try {
			return employeeService.update(employeeRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@PutMapping("/employee/alter-password")
	public ResponseEntity<?> updatePasswordController(@Valid @RequestBody HashMap<String, String> password, Principal principal){
		try {
			return employeeService.updatePassword(password.get("passwordOld"),
													password.get("passwordNew"),  
													principal.getName());
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/employee/findall")
	public ResponseEntity<?> findController(){
		try {
			return ResponseEntity.ok().body(employeeService.findAll());
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@DeleteMapping("/employee/delete")
	public ResponseEntity<?> deleteController(@RequestBody Map<String, Long> requestBody){
		try {
			 employeeService.delete(requestBody.get("id"));
			 return ResponseEntity.ok().build();
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/employee/find")
	public ResponseEntity<?> findController(@RequestParam(name = "key") String key){
		try {
			System.out.println(key);
			return ResponseEntity.ok().body(employeeService.findByNameEmployeeOrDocument(key));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	@GetMapping("/public/employee/entry")
	public ResponseEntity<?> entryController(@RequestParam(name = "idOrDocument") String idOrDocument){
		try {
			//System.out.println(idOrDocument);
			return ResponseEntity.ok().body(employeeService.findByIdOrDocument(idOrDocument));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}

	
	
}
