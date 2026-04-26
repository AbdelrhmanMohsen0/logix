package com.core.orderservice.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.validation.Valid;

public record OrderDTO(
		UUID id,
		String customerName,
		String customerPhone,
		String customerAddress,
		OrderStatus orderCurrentStatus,
		BigDecimal totalAmount,
		List<@Valid ItemDTO> items,
		List<OrderStatusStateDTO> statusHistory
) {}
