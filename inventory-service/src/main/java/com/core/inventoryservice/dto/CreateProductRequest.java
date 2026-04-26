package com.core.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateProductRequest(
		@NotBlank String name,
		@NotNull String sku,
		@NotNull Integer quantity,
		@NotNull Double price,
		@NotBlank String location,
		@NotNull Integer threshold
) {

}
