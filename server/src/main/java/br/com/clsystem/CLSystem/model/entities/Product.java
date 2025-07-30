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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TB_PRODUCT")
public class Product extends AuditableSoftDelete implements Serializable  {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_product")
	private Long idProduct;
	
	@Column(name="name_product", unique=true, length = 44, nullable = false)
	private String nameProduct;
	
	@Column(name="product_description", length = 200)
	private String productDescription;
	
	@Column(name="value_cost")
	private BigDecimal valueCost;
	
	@Column(name="value_sale")
	private BigDecimal valueSale;
	
	@Column(name="bar_code", length = 20, unique = true)
	private String barCode;

	@ManyToOne
	@JoinColumn(name="id_customer")
	private Customer customer;
	
}
