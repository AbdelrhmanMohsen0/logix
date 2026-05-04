package com.core.warehouseservice.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ShipmentDTO(
        UUID orderId,
        String orderDisplayIndex,
        String customerName,
        String customerAddress
) {
}
