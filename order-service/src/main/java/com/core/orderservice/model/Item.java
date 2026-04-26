package com.core.orderservice.model;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Item {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "fk_item_order"))
	private Order order;
	
	@NotNull
	@Column(nullable = false)
	private String SKU;
	
	@NotNull
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private Long quantity = 1L;
	
	@Column(nullable = false)
	private BigDecimal priceAtPurchase;
}
