package com.core.inventoryservice.service;

import com.core.inventoryservice.dto.OrderDTO;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SQSListenerService {
	
	private final InventoryService inventoryService;
	
	@SqsListener("InventoryServiceQueue.fifo")
	public void listen(OrderDTO orderDTO) {
		inventoryService.validateOrder(orderDTO, orderDTO.organizationId());
	}
}
