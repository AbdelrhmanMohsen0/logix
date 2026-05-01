package com.core.warehouseservice.mapper;

import com.core.warehouseservice.domain.Item;
import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.ConfirmedOrderDTO;
import com.core.warehouseservice.dto.ItemDTO;
import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.ShipmentDTO;
import org.springframework.stereotype.Component;

import java.util.List;

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

    public OrderDTO toOrderDTO(Order order){
        List<ItemDTO> items = order.getItems().stream().map(item -> ItemDTO.builder()
                .sku(item.getSku())
                .name(item.getName())
                .quantity(item.getQuantity())
                .location(item.getLocation())
                .build()).toList();

        return OrderDTO.builder()
                .orderId(order.getId())
                .orderStatus(order.getOrderStatus())
                .items(items)
                .numberOfItems(items.size())
                .labelURI(order.getLabelURI())
                .build();
    }

    public ShipmentDTO toShipmentDTO(Order order){
        return ShipmentDTO.builder()
                .orderId(order.getId())
                .customerName(order.getCustomerName())
                .customerAddress(order.getCustomerAddress())
                .build();
    }
}
