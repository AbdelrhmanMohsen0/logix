package com.core.orderservice.mapper;

import com.core.orderservice.dto.ItemDTO;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderStatusStateDTO;
import com.core.orderservice.model.Order;
import com.core.orderservice.model.OrderStatusState;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Component
public class OrderMapper {

    public OrderDTO toOrderDTO(Order order) {
        List<OrderStatusStateDTO> historyDTOs = order.getStatusHistory().stream()
                .sorted(Comparator.comparing(OrderStatusState::getTransitionedAt, Comparator.nullsLast(Instant::compareTo)))
                .map(h -> new OrderStatusStateDTO(h.getStatus(), h.getTransitionedAt()))
                .toList();

        List<ItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new ItemDTO(
                        item.getSKU(),
                        item.getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .toList();

        return new OrderDTO(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getCustomerAddress(),
                order.getCurrentStatus(),
                order.getTotalAmount(),
                itemDTOs,
                historyDTOs
        );
    }
}
