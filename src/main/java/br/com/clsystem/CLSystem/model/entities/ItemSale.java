package br.com.clsystem.CLSystem.model.entities;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="TB_ITEM_SALE")
public class ItemSale implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_item_sale")
	private Long idItemSale;
	
	@NotNull
	@OneToOne
	@JoinColumn(name="id_product")
	private Product idProduct;
	
	@NotNull
	@ManyToOne
	@JoinColumn(name="id_sale")
	private Sale idSale;
	
	@NotNull
	@Column(name="unitary_value")
	private BigDecimal unitaryValue;
	
	@NotNull
	@Column(name="quantity")
	private Integer quantity;
	
	@NotNull
	@Column(name="amounth")
	private BigDecimal amount;
	
}
