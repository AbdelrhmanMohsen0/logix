package com.core.orderservice.controller;

import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.dto.OrderSummaryDTO;
import com.core.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping("/order")
	public OrderDTO createOrder(@Valid @RequestBody OrderRequest order, @RequestHeader("X-Organization-ID") UUID organizationId) {
		return orderService.createOrder(order, organizationId);
	}
	
	@GetMapping("/")
	public List<OrderSummaryDTO> getOrdersSummary(@RequestHeader("X-Organization-ID") UUID organizationId){
		return orderService.getOrdersSummary(organizationId);
	}
	
	@GetMapping("/{id}")
	public OrderDTO getOrder(@RequestHeader("X-Organization-ID") UUID organizationId,
			@PathVariable UUID id) {
		return orderService.getOrder(organizationId, id);
	}
	
}
