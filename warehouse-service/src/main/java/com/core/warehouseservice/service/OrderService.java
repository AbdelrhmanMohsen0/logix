package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.ConfirmedOrderDTO;
import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.OrderSummaryDTO;
import com.core.warehouseservice.dto.ShipmentDTO;
import com.core.warehouseservice.exceptions.OrderNotFoundException;
import com.core.warehouseservice.mapper.OrderMapper;
import com.core.warehouseservice.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;

    public void saveNewOrder(ConfirmedOrderDTO confirmedOrderDTO){
        Order order = orderMapper.fromConfirmedOrderDTOtoOrder(confirmedOrderDTO);
        order.setLabelURI("https://example.com");
        orderRepository.save(order);
    }

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

        order.setOrderStatus(OrderWarehouseStatus.IN_PROGRESS);
        orderRepository.save(order);

        return orderMapper.toOrderDTO(order);
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
        orderRepository.save(order);
    }

}
