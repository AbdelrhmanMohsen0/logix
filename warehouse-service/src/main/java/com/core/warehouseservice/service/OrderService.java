package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.dto.ConfirmedOrderDTO;
import com.core.warehouseservice.mapper.OrderMapper;
import com.core.warehouseservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;

    public void saveNewOrder(ConfirmedOrderDTO confirmedOrderDTO){
        Order order = orderMapper.fromConfirmedOrderDTOtoOrder(confirmedOrderDTO);
        orderRepository.save(order);
    }

}
