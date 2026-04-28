package com.core.inventoryservice.service;

import java.util.UUID;
import com.core.inventoryservice.dto.ConfirmedOrderDTO;
import com.core.inventoryservice.dto.OrderStatusUpdateDTO;
import com.core.inventoryservice.dto.ShipmentReceivedDTO;
import io.awspring.cloud.sns.core.SnsHeaders;
import io.awspring.cloud.sns.core.SnsTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SNSPublisherService {

	private final SnsTemplate snsTemplate;

	@Value("${order.status.topic.arn}")
	private String orderStatusTopicARN;

	public void publishOrderStatusEvent(OrderStatusUpdateDTO orderStatusEvent) {
		Message<OrderStatusUpdateDTO> message = MessageBuilder.withPayload(orderStatusEvent)
				.setHeader(SnsHeaders.MESSAGE_GROUP_ID_HEADER, orderStatusEvent.orderId().toString())
				.setHeader(SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString())
				.build();
		snsTemplate.send(orderStatusTopicARN, message);
	}
	
	@Value("${inventory.allocated.topic.arn}")
	private String inventoryAllocatedTopicARN;
	
	public void publishInventoryAllocatedEvent(ConfirmedOrderDTO confirmedOrder) {
		Message<ConfirmedOrderDTO> message = MessageBuilder.withPayload(confirmedOrder)
				.setHeader(SnsHeaders.MESSAGE_GROUP_ID_HEADER, confirmedOrder.orderId().toString())
				.setHeader(SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString())
				.build();
		snsTemplate.send(inventoryAllocatedTopicARN, message);
	}
	
	@Value("${shipment.received.topic.arn}")
	private String shipmentReceivedTopicARN;
	
	public void publishShipmentReceivedEvent(ShipmentReceivedDTO shipmentReceived) {
		Message<ShipmentReceivedDTO> message = MessageBuilder.withPayload(shipmentReceived)
				.setHeader(SnsHeaders.MESSAGE_GROUP_ID_HEADER, shipmentReceived.shipmentID())
				.setHeader(SnsHeaders.MESSAGE_DEDUPLICATION_ID_HEADER, UUID.randomUUID().toString())
				.build();
		snsTemplate.send(shipmentReceivedTopicARN, message);
	}
	
}
