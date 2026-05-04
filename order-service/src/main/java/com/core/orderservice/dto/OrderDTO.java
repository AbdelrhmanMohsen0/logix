package com.core.orderservice.dto;

import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.validation.Valid;

public record OrderDTO(
		UUID orderId,
		String orderDisplayIndex,
		String customerName,
		String customerPhone,
		String customerAddress,
		OrderStatus orderCurrentStatus,
		Double totalAmount,
		List<@Valid ItemDTO> items,
		List<OrderStatusStateDTO> statusHistory
) {}
