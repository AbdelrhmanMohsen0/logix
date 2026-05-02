package com.core.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateProductRequest(
		@NotBlank String name,
		@NotNull String sku,

		@Positive
		@NotNull
		Long quantity,

		@NotNull
		@Positive
		Double price,

		@NotBlank
		String location,

		@NotNull
		@Positive
		Long threshold
) {

}
