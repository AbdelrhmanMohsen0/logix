package com.core.inventoryservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ShipmentItem(
		@NotNull String sku,
		@Positive Long quantity
) {}
