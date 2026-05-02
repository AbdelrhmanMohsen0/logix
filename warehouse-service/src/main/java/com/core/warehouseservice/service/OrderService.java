package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.ConfirmedOrderEventDTO;
import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.OrderSummaryDTO;
import com.core.warehouseservice.dto.ShipmentDTO;
import com.core.warehouseservice.exceptions.OrderNotFoundException;
import com.core.warehouseservice.mapper.OrderMapper;
import com.core.warehouseservice.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;

    private static final long PICKING_ORDER_LOCK_DURATION_MINUTES = 15;

    public void saveNewOrder(ConfirmedOrderEventDTO confirmedOrderEventDTO){
        Order order = orderMapper.fromConfirmedOrderDTOtoOrder(confirmedOrderEventDTO);
        order.setLabelURI("https://example.com");
        orderRepository.save(order);
    }

    @Transactional
    public List<OrderSummaryDTO> getPickingList(UUID orgId){

        return orderRepository.findAllSummariesByOrganizationIdAndStatuses(
                orgId,
                List.of(OrderWarehouseStatus.PENDING, OrderWarehouseStatus.IN_PROGRESS)
        );
    }

    @Transactional
    public OrderDTO getOrderDetails(UUID orderId, UUID orgId){
        Order order = orderRepository.findByIdAndOrganizationIdWithItems(orderId, orgId)
                .orElseThrow(() -> new OrderNotFoundException("No order found with id: " + orderId));

        Instant now = Instant.now();

        if (order.getOrderStatus() == OrderWarehouseStatus.IN_PROGRESS &&
                order.getLockExpiryTime() != null &&
                order.getLockExpiryTime().isAfter(now)) {
            throw new IllegalStateException("Order is currently locked and being processed by another worker.");
        }

        order.setOrderStatus(OrderWarehouseStatus.IN_PROGRESS);
        order.setLockExpiryTime(now.plus(PICKING_ORDER_LOCK_DURATION_MINUTES, ChronoUnit.MINUTES));
        orderRepository.save(order);

        return orderMapper.toOrderDTO(order);
    }

    @Transactional
    public void cancelOrderPickingLock(UUID orderId, UUID orgId) {
        Order order = orderRepository.findOrderByIdAndOrganizationId(orderId, orgId)
                .orElseThrow(() -> new OrderNotFoundException("No order found with id: " + orderId));

        order.setOrderStatus(OrderWarehouseStatus.PENDING);
        order.setLockExpiryTime(null);
        orderRepository.save(order);
    }

    public List<ShipmentDTO> getAllOrdersReadyForShipping(UUID orgId){
        List<Order> orders = orderRepository.findAllByOrganizationIdAndOrderStatusIn(orgId, List.of(OrderWarehouseStatus.PACKED));
        return orders.stream().map(orderMapper::toShipmentDTO).toList();
    }

    @Transactional
    public void markShipmentAsShipped(UUID orderId, UUID orgId){
        Order order = orderRepository.findOrderByIdAndOrganizationId(orderId, orgId)
                .orElseThrow(() -> new OrderNotFoundException("No order found with id: " + orderId));
        order.setOrderStatus(OrderWarehouseStatus.SHIPPED);
        orderRepository.save(order);
    }

    @Transactional
    public void markOrderAsPacked(UUID orderId, UUID orgId){
        Order order = orderRepository.findOrderByIdAndOrganizationId(orderId, orgId)
                .orElseThrow(() -> new OrderNotFoundException("No order found with id: " + orderId));

        order.setOrderStatus(OrderWarehouseStatus.PACKED);
        order.setLockExpiryTime(null);
        orderRepository.save(order);
    }

}
