package com.core.orderservice.dto;

import java.time.Instant;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateDTO(
		@NotNull UUID orderId,
		@NotNull OrderStatus nextStatus,
		@NotNull Instant transitionedAt
) {}
