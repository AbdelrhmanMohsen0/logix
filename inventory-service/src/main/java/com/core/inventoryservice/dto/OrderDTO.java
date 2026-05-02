package com.core.inventoryservice.dto;

import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import jakarta.validation.Valid;

public record OrderDTO(
		UUID orderId,
		String customerName,
		String customerPhone,
		String customerAddress,
		OrderStatus orderCurrentStatus,
		Double totalAmount,
		List<@Valid ItemDTO> items,
		List<OrderStatusStateDTO> statusHistory
) {}
