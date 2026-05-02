package com.core.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import util.UniqueProductSku;

public record CreateProductRequest(
		@NotBlank String name,

		@NotNull
		@UniqueProductSku
		String sku,

		@NotNull Long quantity,
		@NotNull Double price,
		@NotBlank String location,
		@NotNull Long threshold
) {

}
