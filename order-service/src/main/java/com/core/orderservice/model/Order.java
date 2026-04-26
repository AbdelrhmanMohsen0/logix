package com.core.orderservice.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "orders")
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@NotNull
	@Column(nullable = false)
	private UUID organizationId;

	@NotBlank
	@Column(nullable = false)
	private String customerName;

	@NotBlank
	@Column(nullable = false)
	private String customerPhone;

	@NotBlank
	@Column(nullable = false)
	private String customerAddress;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Item> items = new ArrayList<>();

	@Column(nullable = false)
	private BigDecimal totalAmount = BigDecimal.ZERO;
	
	@Enumerated(EnumType.STRING)
	private OrderStatus currentStatus;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderStatusState> statusHistory = new ArrayList<>();

	public void addStatusHistory(OrderStatusState orderStatusState) {
		this.statusHistory.add(orderStatusState);
	}
	
	public void addItem(Item item) {
		items.add(item);
		item.setOrder(this);
		BigDecimal itemTotal = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()));
		this.totalAmount = this.totalAmount.add(itemTotal);
	}
}
