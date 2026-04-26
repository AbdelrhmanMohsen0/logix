package com.core.orderservice.dto;

import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateDTO(
		@NotNull UUID orderId,
		@NotNull OrderStatus newStatus
) {}
