package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderStatusUpdateDTO(
		@NotNull UUID orderId,
		@NotNull OrderStatus newStatus
) {}
