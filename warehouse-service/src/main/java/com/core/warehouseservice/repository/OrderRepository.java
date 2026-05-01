package com.core.warehouseservice.repository;

import com.core.warehouseservice.domain.Order;
import com.core.warehouseservice.domain.OrderWarehouseStatus;
import com.core.warehouseservice.dto.OrderSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("""
        SELECT new com.core.warehouseservice.dto.OrderSummaryDTO(
            o.id, SIZE(o.items), o.orderStatus
        )
        FROM Order o
        WHERE o.organizationId = :organizationId
        AND o.orderStatus IN :statuses
    """)
    List<OrderSummaryDTO> findAllSummariesByOrganizationIdAndStatuses(
            @Param("organizationId") UUID organizationId,
            @Param("statuses") List<OrderWarehouseStatus> statuses
    );

    @Query("""
        SELECT o FROM Order o
        LEFT JOIN FETCH o.items
        WHERE o.id = :orderId
        AND o.organizationId = :organizationId
    """)
    Optional<Order> findByIdAndOrganizationIdWithItems(
            @Param("orderId") UUID orderId,
            @Param("organizationId") UUID organizationId
    );

    Optional<Order> findOrderByIdAndOrganizationId(UUID id, UUID organizationId);
    List<Order> findAllByOrganizationId(UUID organizationId);
    List<Order> findAllByOrganizationIdAndOrderStatusIn(UUID organizationId, List<OrderWarehouseStatus> orderStatus);

}
