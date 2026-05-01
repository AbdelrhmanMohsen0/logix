package com.core.warehouseservice.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ShipmentDTO(
        UUID orderId,
        String customerName,
        String customerAddress
) {
}
