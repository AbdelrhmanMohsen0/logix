package com.core.orderservice.service;

import com.core.orderservice.dto.OrderDTO;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.GetQueueUrlRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SqsPublisherService {
	
	private final SqsClient sqsClient;
	private final ObjectMapper objectMapper;
	
	public void sendMessage(String queueName, OrderDTO order){
		
		String message = objectMapper.writeValueAsString(order);
		
		String queueUrl = sqsClient.getQueueUrl(
				GetQueueUrlRequest.builder().queueName(queueName).build()
		).queueUrl();

		sqsClient.sendMessage(
				SendMessageRequest.builder()
						.queueUrl(queueUrl)
						.messageBody(message)
						.build()
		);
		
	}
	
}
