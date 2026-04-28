package com.core.inventoryservice.dto;

import com.core.inventoryservice.domain.ProductStatus;

public record ProductDTO(
		String name,
		String sku,
		Integer quantity,
		Double price,
		String location,
		ProductStatus stockStatus
) {}
