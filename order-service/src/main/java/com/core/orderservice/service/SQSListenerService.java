package com.core.orderservice.service;

import com.core.orderservice.dto.OrderStatusUpdateDTO;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SQSListenerService {

    private final OrderService orderService;

    @SqsListener("OrderServiceQueue.fifo")
	public void listen(OrderStatusUpdateDTO event) {
        orderService.changeStatus(event.orderId(), event.newStatus());
        System.out.println("The order with the id " +  event.orderId() + " has been changed to " + event.newStatus());
	}

}
