package com.core.orderservice.controller;

import java.util.UUID;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.dto.OrderSummaryDTO;
import com.core.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping
	@PreAuthorize("hasRole('SALES')")
	public OrderDTO createOrder(@Valid @RequestBody OrderRequest order, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return orderService.createOrder(order, orgId);
	}
	
	@GetMapping
	@PreAuthorize("hasRole('SALES')")
	public ResponseEntity<PagedModel<OrderSummaryDTO>> getOrderSummaries(
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			JwtAuthenticationToken auth){
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());

		Pageable pageable = PageRequest.of(page, size);
		Page<OrderSummaryDTO> orderSummaries = orderService.getOrderSummaries(pageable, orgId);

		return ResponseEntity.ok(new PagedModel<>(orderSummaries));
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('SALES')")
	public OrderDTO getOrder(JwtAuthenticationToken auth, @PathVariable UUID id) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return orderService.getOrder(orgId, id);
	}

}
