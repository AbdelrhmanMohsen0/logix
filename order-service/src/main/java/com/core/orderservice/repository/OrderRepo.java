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
	
	// This handles N+1 problem
	@Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
	Optional<Order> findByIdWithItems(@Param("id") UUID id);
	
	@Query("SELECT new com.core.orderservice.dto.OrderSummaryDTO(" +
			"o.id, o.customerName, MIN(h.transitionedAt), o.currentStatus, o.totalAmount) " +
			"FROM Order o " +
			"JOIN o.statusHistory h " + // Join to get the dates
			"WHERE o.organizationId = :orgId " + // Security/Org filter
			"GROUP BY o.id, o.customerName, o.currentStatus, o.totalAmount")
	List<OrderSummaryDTO> findAllSummariesByOrg(@Param("orgId") UUID orgId);
	
	@Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id and o.organizationId = :orgId")
	Optional<Order> getOrderByOrganizationIdAndOrderId (UUID orgId, UUID id);
	
	@Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
	Optional<Order> findByOrderId (UUID id);
}
