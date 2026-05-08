package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.OrderSummaryDTO;
import com.core.warehouseservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/warehouse/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<PagedModel<OrderSummaryDTO>> getPickingList(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderSummaryDTO> orders = orderService.getPickingList(pageable, orgId);

        return ResponseEntity.ok(new PagedModel<>(orders));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable UUID orderId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        UUID userId = UUID.fromString(auth.getToken().getSubject());
        return ResponseEntity.ok(orderService.getOrderDetails(orderId, orgId, userId));
    }

    @PostMapping("/{orderId}/pack")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> markOrderAsPacked(@PathVariable UUID orderId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markOrderAsPacked(orderId, orgId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> cancelOrderPickingLock(@PathVariable UUID orderId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.cancelOrderPickingLock(orderId, orgId);
        return ResponseEntity.ok().build();
    }

}
