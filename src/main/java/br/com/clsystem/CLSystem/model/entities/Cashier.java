package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.clsystem.CLSystem.types.StatusCashier;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="TB_CASHIER")
public class Cashier implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="id_cashier")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idCashier;
	
	@ManyToOne
	@JoinColumn(name="id_employee", nullable = false)
	private Employee employee;
	
	@Column(name="date_hour_open", nullable = false)
	private LocalDateTime dateHourOpen;
	
	@Column(name="date_hour_close", nullable = false)
	private LocalDateTime dateHourClose;
	
	@Column(name="initial_value")
	private BigDecimal initialValue;
	
	@Column(name="status", nullable = false, length = 44)
	@Enumerated(EnumType.STRING)
	private StatusCashier status;
	
}