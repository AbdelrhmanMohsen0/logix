package com.core.warehouseservice.dto;

import lombok.Builder;

@Builder
public record ItemDTO(
    String sku,
    String name,
    Long quantity,
    String location
) {
}
