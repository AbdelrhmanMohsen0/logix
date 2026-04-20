package com.core.orderservice.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@NotBlank
	private String customerName;
	
	@NotBlank
	private String customerPhone;
	
	@NotBlank
	private String customerAddress;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Item> items = new ArrayList<>();
	
	private BigDecimal totalAmount = BigDecimal.ZERO;
	
	@Enumerated(EnumType.STRING)
	private OrderStatus currentStatus;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderStatusHistory> statusHistory = new ArrayList<>();
	
	public void updateStatus(OrderStatus newStatus) {
		this.currentStatus = newStatus;
		
		OrderStatusHistory history = new OrderStatusHistory();
		history.setOrder(this);
		history.setStatus(newStatus);
		
		this.statusHistory.add(history);
	}
	
	public void addStatusHistory(OrderStatusHistory history) {
		this.statusHistory.add(history);
		history.setOrder(this);
	}
	
	public void addItem(Item item) {
		items.add(item);
		item.setOrder(this);
		BigDecimal itemTotal = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()));
		this.totalAmount = this.totalAmount.add(itemTotal);
	}
}
