package com.core.inventoryservice.dto;

import java.util.UUID;

public record ShipmentReceivedDTO(
		UUID organizationId,
		String shipmentID,
		String supplierName,
		Long totalNumberOfItems
) {}
