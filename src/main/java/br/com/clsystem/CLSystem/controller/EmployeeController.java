package br.com.clsystem.CLSystem.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins="*", maxAge = 3600) //Permitir ser acessado de Qualquer fonte
@RequestMapping("/api/employee")
public class EmployeeController {

	final EmployeeService employeeService;
	
	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveController(@Valid @RequestBody EmployeeRecord employeeRecord, BindingResult br){
		try {
			return employeeService.save(employeeRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@PutMapping("/save")
	public ResponseEntity<?> updateController(@Valid @RequestBody EmployeeRecord employeeRecord, BindingResult br){
		try {
			return employeeService.update(employeeRecord);
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/findall")
	public ResponseEntity<?> findController(){
		try {
			return ResponseEntity.ok().body(employeeService.findAll());
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteController(@RequestBody Map<String, Long> requestBody){
		try {
			 employeeService.delete(requestBody.get("id"));
			 return ResponseEntity.ok().build();
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
	@GetMapping("/find")
	public ResponseEntity<?> findController(@RequestParam(name = "key") String key){
		try {
			System.out.println(key);
			return ResponseEntity.ok().body(employeeService.findByNameEmployeeOrDocument(key));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	@GetMapping("/entry")
	public ResponseEntity<?> entryController(@RequestParam(name = "idOrDocument") String idOrDocument){
		try {
			//System.out.println(idOrDocument);
			return ResponseEntity.ok().body(employeeService.findByIdOrDocument(idOrDocument));
		}catch(DataBaseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.handleException());
		}
	}
	
}
