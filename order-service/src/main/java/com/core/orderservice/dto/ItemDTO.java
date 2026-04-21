package com.core.orderservice.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ItemDTO(
		@NotBlank String SKU,
		@NotBlank String name,
		@Positive Long quantity,
		@Positive BigDecimal priceAtPurchase
) {}
