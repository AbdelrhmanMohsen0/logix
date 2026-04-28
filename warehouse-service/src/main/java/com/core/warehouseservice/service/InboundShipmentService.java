package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.InboundShipment;
import com.core.warehouseservice.dto.ReceivedShipmentEventDTO;
import com.core.warehouseservice.repository.InboundShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InboundShipmentService {

    private final InboundShipmentRepository inboundShipmentRepository;

    public void saveInboundShipment(ReceivedShipmentEventDTO receivedShipmentEventDTO) {
        InboundShipment inboundShipment = InboundShipment.builder()
                .shipmentId(receivedShipmentEventDTO.shipmentID())
                .supplierName(receivedShipmentEventDTO.supplierName())
                .totalItemsReceived(receivedShipmentEventDTO.totalNumberOfItems())
                .build();
        inboundShipmentRepository.save(inboundShipment);
    }
}
