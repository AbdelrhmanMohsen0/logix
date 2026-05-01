package com.core.warehouseservice.dto;

import com.core.warehouseservice.domain.OrderWarehouseStatus;
import jakarta.validation.Valid;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record OrderDTO(
    UUID orderId,
    OrderWarehouseStatus orderStatus,
    Integer numberOfItems,
    String labelURI,
    List<@Valid ItemDTO> items
) {
}
