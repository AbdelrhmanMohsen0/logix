package com.core.warehouseservice.service;

import com.core.warehouseservice.dto.ReceivedShipmentEventDTO;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class SQSListenerService {

    private final ObjectMapper objectMapper;
    private final InboundShipmentService inboundShipmentService;

    @SqsListener("WarehouseServiceQueue.fifo")
    public void listen(String payload, @Header("eventType") String eventType) {
        switch (eventType) {
            case "SHIPMENT_RECEIVED" -> handleShipmentReceived(objectMapper.readValue(payload, ReceivedShipmentEventDTO.class));
            case "INVENTORY_ALLOCATED" -> handleInventoryAllocated();
        }
    }

    private void handleShipmentReceived(ReceivedShipmentEventDTO receivedShipmentEventDTO) {
        inboundShipmentService.saveInboundShipment(receivedShipmentEventDTO);
    }

    private void handleInventoryAllocated() {
    }

}
