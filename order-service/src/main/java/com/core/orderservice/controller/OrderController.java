package com.core.orderservice.controller;

import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping("/order")
	public OrderDTO createOrder(@Valid @RequestBody OrderRequest order) {
		return orderService.createOrder(order);
	}
	
}
