package com.core.inventoryservice.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record AddingShipmentRequest(
		@NotBlank String shipmentId,
		@NotBlank String supplierName,
		@Valid List<ShipmentItem> items
) {}
