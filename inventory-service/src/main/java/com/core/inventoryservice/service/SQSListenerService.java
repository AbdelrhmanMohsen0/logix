package com.core.inventoryservice.service;

import com.core.inventoryservice.dto.OrderDTO;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SQSListenerService {
	
	private final InventoryService inventoryService;
	
	@SqsListener("InventoryServiceQueue.fifo")
	public void listen(OrderDTO orderDTO, @Header("orgId") String orgId) {
		inventoryService.validateOrder(orderDTO, UUID.fromString(orgId));
	}
}
