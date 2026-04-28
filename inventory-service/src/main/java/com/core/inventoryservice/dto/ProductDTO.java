package com.core.inventoryservice.dto;

import com.core.inventoryservice.domain.ProductStatus;
import lombok.Builder;

@Builder
public record ProductDTO(
		String name,
		String sku,
		Integer quantity,
		Double price,
		String location,
		ProductStatus stockStatus
) {}
