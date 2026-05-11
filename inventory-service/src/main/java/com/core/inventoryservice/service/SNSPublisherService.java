package com.core.inventoryservice.service;

import java.util.Map;
import java.util.UUID;
import com.core.inventoryservice.dto.ConfirmedOrderDTO;
import com.core.inventoryservice.dto.OrderStatusUpdateDTO;
import com.core.inventoryservice.dto.ShipmentReceivedDTO;
import io.awspring.cloud.sns.core.SnsHeaders;
import io.awspring.cloud.sns.core.SnsTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
	
	@Value("${inventory.allocated.topic.arn}")
	private String inventoryAllocatedTopicARN;
	
	public void publishInventoryAllocatedEvent(ConfirmedOrderDTO confirmedOrder) {
		Map<String, Object> headers = Map.of(
				SnsHeaders.MESSAGE_GROUP_ID_HEADER, UUID.randomUUID().toString(),
				SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString(),
				"eventType", "INVENTORY_ALLOCATED"
		);
		snsTemplate.convertAndSend(inventoryAllocatedTopicARN, confirmedOrder, headers);
	}
	
	@Value("${shipment.received.topic.arn}")
	private String shipmentReceivedTopicARN;
	
	public void publishShipmentReceivedEvent(ShipmentReceivedDTO shipmentReceived) {
		Map<String, Object> headers = Map.of(
				SnsHeaders.MESSAGE_GROUP_ID_HEADER, UUID.randomUUID().toString(),
				SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString(),
				"eventType", "SHIPMENT_RECEIVED"
		);
		snsTemplate.convertAndSend(shipmentReceivedTopicARN, shipmentReceived, headers);
	}
	
}
