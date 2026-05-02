package com.core.orderservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ItemDTO(
		@NotBlank String sku,
		@NotBlank String name,
		@Positive Long quantity,
		@Positive Double priceAtPurchase
) {}
