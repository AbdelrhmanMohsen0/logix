package com.core.warehouseservice.service;

import com.core.warehouseservice.domain.InboundShipment;
import com.core.warehouseservice.dto.InboundShipmentDTO;
import com.core.warehouseservice.dto.ReceivedShipmentEventDTO;
import com.core.warehouseservice.mapper.InboundShipmentMapper;
import com.core.warehouseservice.repository.InboundShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InboundShipmentService {

    private final InboundShipmentRepository inboundShipmentRepository;
    private final InboundShipmentMapper inboundShipmentMapper;

    public void saveInboundShipment(ReceivedShipmentEventDTO receivedShipmentEventDTO) {
        InboundShipment inboundShipment = InboundShipment.builder()
                .organizationId(receivedShipmentEventDTO.organizationId())
                .shipmentId(receivedShipmentEventDTO.shipmentID())
                .supplierName(receivedShipmentEventDTO.supplierName())
                .totalItemsReceived(receivedShipmentEventDTO.totalNumberOfItems())
                .build();
        inboundShipmentRepository.save(inboundShipment);
    }

    public Page<InboundShipmentDTO> getInboundShipments(Pageable pageable, UUID orgId) {
        return inboundShipmentRepository.findAllByOrganizationId(pageable, orgId)
                .map(inboundShipmentMapper::toInboundShipmentDTO);
    }

}
