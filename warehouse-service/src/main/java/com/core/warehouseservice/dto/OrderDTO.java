package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.OrderWarehouseStatus;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record OrderDTO(
    UUID orderId,
    String orderDisplayIndex,
    OrderWarehouseStatus orderStatus,
    Integer numberOfItems,
    String labelURI,
    List<ItemDTO> items
) {
}
