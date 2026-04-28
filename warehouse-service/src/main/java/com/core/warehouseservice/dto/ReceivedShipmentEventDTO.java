package com.core.warehouseservice.dto;

import lombok.Builder;

@Builder
public record ReceivedShipmentEventDTO(
        String shipmentID,
        String supplierName,
        Long totalNumberOfItems
) {
}
