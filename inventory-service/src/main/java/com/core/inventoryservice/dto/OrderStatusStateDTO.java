package com.core.inventoryservice.dto;

import java.time.Instant;
import com.core.inventoryservice.domain.OrderStatus;

public record OrderStatusStateDTO(
		OrderStatus status,
		Instant transitionedAt
) {}
