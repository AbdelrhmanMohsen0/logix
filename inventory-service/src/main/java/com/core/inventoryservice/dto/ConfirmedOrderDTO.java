package com.core.inventoryservice.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import jakarta.validation.Valid;
import lombok.Builder;

@Builder
public record ConfirmedOrderDTO(
		UUID orderId,
		String customerName,
		String customerPhone,
		String customerAddress,
		OrderStatus orderCurrentStatus,
		BigDecimal totalAmount,
		List<@Valid ProductDTO> products
) {}
