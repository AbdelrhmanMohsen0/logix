package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.OrderWarehouseStatus;

import java.util.UUID;

public record OrderSummaryDTO(
        UUID orderId,
        Integer numberOfItems,
        OrderWarehouseStatus orderWarehouseStatus
) {
}
