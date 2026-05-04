package com.core.inventoryservice.dto;

import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import jakarta.validation.Valid;
import lombok.Builder;

@Builder
public record ConfirmedOrderDTO(
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
