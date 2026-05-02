package com.core.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ItemDTO(
		@NotBlank String sku,
		@NotBlank String name,
		@Positive Integer quantity,
		@Positive Double priceAtPurchase
) {}
