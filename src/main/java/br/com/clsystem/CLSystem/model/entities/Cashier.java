package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.clsystem.CLSystem.types.StatusCashier;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
	
	@Column(name="date_hour_close")
	private LocalDateTime dateHourClose;
	
	@Column(name="initial_value")
	private BigDecimal initialValue;
	
	@Column(name="status", nullable = false, length = 44)
	@Enumerated(EnumType.STRING)
	private StatusCashier status;

	@OneToMany(mappedBy = "idCashier")
	@JsonIgnore
	private List<Sale> listSale = new ArrayList<>();

	public BigDecimal  getAmountSales(){
       listSale.stream().forEach(item -> item.calculateAmount());
		return listSale
		.stream()
		.map(Sale::getAmount)
		.reduce(new BigDecimal(0.0), BigDecimal::add);
	}
}
