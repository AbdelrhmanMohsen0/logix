package com.core.inventoryservice.dto;

import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateDTO(
		@NotNull UUID orderId,
		@NotNull OrderStatus newStatus
) {}
