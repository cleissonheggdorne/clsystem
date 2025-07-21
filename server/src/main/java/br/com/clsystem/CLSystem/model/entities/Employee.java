package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.util.Date;

import br.com.clsystem.CLSystem.model.entities.record.EmployeeRecord;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name="TB_EMPLOYEE")
public class Employee implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_employee")
	private Long idEmployee;
	
	@Column(name="name_employee", unique=true, length = 44, nullable = false)
	private String nameEmployee;
	
	@Column(name="document", length = 14, nullable = false, unique = true)
	private String document;
	
	@Column(name="initial_date")
	@Temporal(TemporalType.DATE)
	private Date initialDate;

	@Column(name="password")
	private String password; 

	public EmployeeRecord factoryEmployeeRecord(Employee employee) {
		return new EmployeeRecord(employee.getIdEmployee(),
								employee.getNameEmployee(),
								employee.getDocument(),
								employee.getInitialDate(),
								employee.getPassword());
	}
}
