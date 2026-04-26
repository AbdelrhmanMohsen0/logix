package com.core.inventoryservice.service;

import com.core.inventoryservice.repository.ProductRepo;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SQSListenerService {
	
	private final ProductRepo productRepo;
	
	@SqsListener("OrderCreatedQueue.fifo")
	public void listen() {
	
	}
}
