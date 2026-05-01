package com.core.warehouseservice.repository;

import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findOrderByIdAndOrganizationId(UUID id, UUID organizationId);
    List<Order> findAllByOrganizationId(UUID organizationId);
    List<Order> findAllByOrganizationIdAndOrderStatus(UUID organizationId, OrderWarehouseStatus orderStatus);

}
