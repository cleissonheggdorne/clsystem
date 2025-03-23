package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.clsystem.CLSystem.types.FormPayment;
import br.com.clsystem.CLSystem.types.StatusSale;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name="TB_SALE")
public class Sale implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_sale")
	private Long idSale;
	
	@Column(name="form_payment", nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private FormPayment formPayment;
	
	@ManyToOne
	@JoinColumn(name="id_cashier")
	private Cashier idCashier;
	
	@Column(name="date_hour_open", nullable = false)
	private LocalDateTime dateHourEntry;

	@Column(name="date_hour_close")
	private LocalDateTime dateHourClose;
	
	@OneToMany(mappedBy = "idSale")
	@JsonIgnore
	private List<ItemSale> listItems = new ArrayList<>();
	
	@Column(name="status", nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private StatusSale statusSale;
    
	@Transient 
	private BigDecimal amount;

	public void calculateAmount(){
		amount = listItems
		.stream()
		.map(ItemSale::getAmount)
		.reduce(new BigDecimal(0.0), BigDecimal::add);
	}
}
