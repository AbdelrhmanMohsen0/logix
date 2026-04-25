package com.core.orderservice.controller;

import java.util.List;
import java.util.UUID;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.dto.OrderSummaryDTO;
import com.core.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public List<OrderSummaryDTO> getOrderSummaries(JwtAuthenticationToken auth){
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return orderService.getOrderSummaries(orgId);
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('SALES')")
	public OrderDTO getOrder(JwtAuthenticationToken auth, @PathVariable UUID id) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return orderService.getOrder(orgId, id);
	}

}
