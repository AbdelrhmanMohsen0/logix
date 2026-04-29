package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.ProductStatus;
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
