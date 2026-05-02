package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.InboundShipment;
import com.core.warehouseservice.dto.InboundShipmentDTO;
import com.core.warehouseservice.dto.ReceivedShipmentEventDTO;
import com.core.warehouseservice.mapper.InboundShipmentMapper;
import com.core.warehouseservice.repository.InboundShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InboundShipmentService {

    private final InboundShipmentRepository inboundShipmentRepository;
    private final InboundShipmentMapper inboundShipmentMapper;

    public void saveInboundShipment(ReceivedShipmentEventDTO receivedShipmentEventDTO) {
        InboundShipment inboundShipment = InboundShipment.builder()
                .shipmentId(receivedShipmentEventDTO.shipmentID())
                .supplierName(receivedShipmentEventDTO.supplierName())
                .totalItemsReceived(receivedShipmentEventDTO.totalNumberOfItems())
                .build();
        inboundShipmentRepository.save(inboundShipment);
    }

    public List<InboundShipmentDTO> getInboundShipments(UUID orgId) {
        return inboundShipmentRepository.findAllByOrganizationId(orgId).stream()
                .map(inboundShipmentMapper::toInboundShipmentDTO)
                .toList();
    }

}
