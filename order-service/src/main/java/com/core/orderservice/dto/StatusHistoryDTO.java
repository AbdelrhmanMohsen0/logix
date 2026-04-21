package com.core.orderservice.dto;

import java.time.Instant;
import com.core.orderservice.domain.OrderStatus;

public record StatusHistoryDTO (
		OrderStatus status,
		Instant transitionedAt
) {}
