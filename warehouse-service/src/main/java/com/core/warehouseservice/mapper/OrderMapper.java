package com.core.warehouseservice.mapper;

import com.core.warehouseservice.domain.Item;
import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.ConfirmedOrderDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public Order fromConfirmedOrderDTOtoOrder(ConfirmedOrderDTO confirmedOrderDTO){
        return Order.builder()
                .id(confirmedOrderDTO.orderId())
                .organizationId(confirmedOrderDTO.orgId())
                .customerName(confirmedOrderDTO.customerName())
                .customerPhone(confirmedOrderDTO.customerPhone())
                .customerAddress(confirmedOrderDTO.customerAddress())
                .orderStatus(OrderWarehouseStatus.PENDING)
                .items(confirmedOrderDTO.products().stream().map(
                        productDTO -> Item.builder()
                                .sku(productDTO.sku())
                                .name(productDTO.name())
                                .location(productDTO.location())
                                .quantity(productDTO.quantity())
                                .build()
                ).toList())
                .totalAmount(confirmedOrderDTO.totalAmount())
                .build();
    }
}
