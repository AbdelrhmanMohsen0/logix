package com.core.warehouseservice.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ReceivedShipmentEventDTO(
        UUID organizationId,
        String shipmentID,
        String supplierName,
        Long totalNumberOfItems
) {
}
