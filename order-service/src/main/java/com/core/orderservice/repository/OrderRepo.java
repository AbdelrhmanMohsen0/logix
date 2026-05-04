package com.core.orderservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.orderservice.dto.OrderSummaryDTO;
import com.core.orderservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepo extends JpaRepository<Order, UUID> {

	@Query("SELECT new com.core.orderservice.dto.OrderSummaryDTO(" +
			"o.id, CONCAT('ORD-', o.orderDisplayIndex), o.customerName, h.transitionedAt, o.currentStatus, o.totalAmount) " +
			"FROM Order o " +
			"JOIN o.statusHistory h " +
			"WHERE o.organizationId = :orgId " +
			"AND h.status = com.core.orderservice.domain.OrderStatus.CREATED " +
			"ORDER BY h.transitionedAt DESC")
	List<OrderSummaryDTO> findAllSummariesByOrg(@Param("orgId") UUID orgId);
	
	@Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id and o.organizationId = :orgId")
	Optional<Order> getOrderByOrganizationIdAndOrderId (UUID orgId, UUID id);

	@Query("SELECT COALESCE(MAX(o.orderDisplayIndex), 0) FROM Order o WHERE o.organizationId = :orgId")
	Long findMaxDisplayIndexByOrg(@Param("orgId") UUID orgId);

}
