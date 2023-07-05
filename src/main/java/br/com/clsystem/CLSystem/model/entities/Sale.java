package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
	
	@OneToOne
	@JoinColumn(name="id_form_payment", nullable = false)
	private FormPayment idFormPayment;
	
	@OneToOne
	@JoinColumn(name="id_cashier", nullable = false)
	private Cashier idCashier;
	
	@Column(name="date_hour_sale", nullable = false)
	private LocalDateTime dateHourSale;
	
	@OneToMany(mappedBy = "idSale")
	List<ItemSale> listItems = new ArrayList<>();
	
}