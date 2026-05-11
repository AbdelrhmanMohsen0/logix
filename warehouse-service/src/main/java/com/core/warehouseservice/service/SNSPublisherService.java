package com.core.warehouseservice.service;


import com.core.warehouseservice.dto.OrderStatusUpdateDTO;
import io.awspring.cloud.sns.core.SnsHeaders;
import io.awspring.cloud.sns.core.SnsTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SNSPublisherService {

	private final SnsTemplate snsTemplate;

	@Value("${order.status.topic.arn}")
	private String orderStatusTopicARN;

	public void publishOrderStatusEvent(OrderStatusUpdateDTO orderStatusEvent) {
		Map<String, Object> headers = Map.of(
				SnsHeaders.MESSAGE_GROUP_ID_HEADER, UUID.randomUUID().toString(),
				SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString()
		);
		snsTemplate.convertAndSend(orderStatusTopicARN, orderStatusEvent, headers);
	}

}
