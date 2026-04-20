package com.core.orderservice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;

public record OrderSummaryDTO(
		UUID id,
		String customerName,
		Instant orderDate,
		OrderStatus currentStatus,
		BigDecimal totalAmount
) {}
