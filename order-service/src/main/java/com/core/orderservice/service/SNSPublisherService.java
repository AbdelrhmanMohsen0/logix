package com.core.orderservice.service;

import com.core.orderservice.dto.OrderDTO;
import io.awspring.cloud.sns.core.SnsHeaders;
import io.awspring.cloud.sns.core.SnsTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SNSPublisherService {

	private final SnsTemplate snsTemplate;

	@Value("${order.created.topic.arn}")
	private String topicARN;

	public void publishOrderCreatedEvent(OrderDTO orderCreatedEvent) {
		Message<OrderDTO> message = MessageBuilder.withPayload(orderCreatedEvent)
				.setHeader(SnsHeaders.MESSAGE_GROUP_ID_HEADER, orderCreatedEvent.id().toString())
				.setHeader(SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString())
				.build();
		snsTemplate.send(topicARN, message);
	}
	
}
