package com.core.warehouseservice.mapper;

import com.core.warehouseservice.domain.Item;
import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.ConfirmedOrderEventDTO;
import com.core.warehouseservice.dto.ItemDTO;
import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.ShipmentDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public Order fromConfirmedOrderDTOtoOrder(ConfirmedOrderEventDTO confirmedOrderEventDTO){
        Order order = Order.builder()
                .id(confirmedOrderEventDTO.orderId())
                .organizationId(confirmedOrderEventDTO.orgId())
                .customerName(confirmedOrderEventDTO.customerName())
                .customerPhone(confirmedOrderEventDTO.customerPhone())
                .customerAddress(confirmedOrderEventDTO.customerAddress())
                .orderStatus(OrderWarehouseStatus.PENDING)
                .totalAmount(confirmedOrderEventDTO.totalAmount())
                .build();

        List<Item> items = confirmedOrderEventDTO.products().stream()
                .map(productDTO -> Item.builder()
                        .sku(productDTO.sku())
                        .name(productDTO.name())
                        .location(productDTO.location())
                        .quantity(productDTO.quantity())
                        .order(order)
                        .build())
                .toList();

        order.setItems(items);
        return order;
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
