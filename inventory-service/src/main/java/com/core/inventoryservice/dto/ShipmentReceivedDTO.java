package com.core.inventoryservice.dto;

public record ShipmentReceivedDTO(
		String shipmentID,
		String supplierName,
		int totalNumberOfItems
) {}
