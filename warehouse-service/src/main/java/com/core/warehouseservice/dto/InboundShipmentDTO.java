package com.core.warehouseservice.dto;

import lombok.Builder;

import java.time.Instant;

@Builder
public record InboundShipmentDTO(
        String shipmentID,
        String supplierName,
        Long totalNumberOfItems,
        Instant receivingDate
) {
}
