package com.core.warehouseservice.mapper;

import com.core.warehouseservice.domain.InboundShipment;
import com.core.warehouseservice.dto.InboundShipmentDTO;
import org.springframework.stereotype.Component;

@Component
public class InboundShipmentMapper {

    public InboundShipmentDTO toInboundShipmentDTO(InboundShipment inboundShipment) {
        return InboundShipmentDTO.builder()
                .shipmentID(inboundShipment.getShipmentId())
                .supplierName(inboundShipment.getSupplierName())
                .totalNumberOfItems(inboundShipment.getTotalItemsReceived())
                .receivingDate(inboundShipment.getReceivingDate())
                .build();

    }
}
