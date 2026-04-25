package com.core.orderservice.model;

import java.time.Instant;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class OrderStatusState {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id")
	private Order order;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, updatable = false)
	private OrderStatus status;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant transitionedAt;
	
}
