package com.core.orderservice.service;

import com.core.orderservice.dto.OrderDTO;
import io.awspring.cloud.sns.core.SnsHeaders;
import io.awspring.cloud.sns.core.SnsTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SNSPublisherService {

	private final SnsTemplate snsTemplate;

	@Value("${order.created.topic.arn}")
	private String topicARN;

	public void publishOrderCreatedEvent(OrderDTO orderCreatedEvent, UUID orgId) {
		Map<String, Object> headers = Map.of(
				SnsHeaders.MESSAGE_GROUP_ID_HEADER, orderCreatedEvent.orderId().toString(),
				SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString(),
				"orgId", orgId.toString()
		);

		snsTemplate.convertAndSend(topicARN, orderCreatedEvent, headers);
	}

}
