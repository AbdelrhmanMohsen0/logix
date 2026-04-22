package com.core.orderservice.service;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.GetQueueUrlRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SqsPublisherService {
	
	private final SqsClient sqsClient;
	
	public void sendMessage(String queueName, String message) {
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
