package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.OrderStatus;
import jakarta.validation.Valid;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record ConfirmedOrderEventDTO(
		UUID orderId,
		String orderDisplayIndex,
		UUID orgId,
		String customerName,
		String customerPhone,
		String customerAddress,
		OrderStatus orderCurrentStatus,
		Double totalAmount,
		List<@Valid ProductDTO> products
) {}
