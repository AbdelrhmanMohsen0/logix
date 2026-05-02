package com.core.warehouseservice.repository;

import com.core.warehouseservice.domain.InboundShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InboundShipmentRepository extends JpaRepository<InboundShipment, UUID> {

    List<InboundShipment> findAllByOrganizationId(UUID organizationId);
}
