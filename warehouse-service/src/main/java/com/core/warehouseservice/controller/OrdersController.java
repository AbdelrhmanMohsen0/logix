package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.OrderDTO;
import com.core.warehouseservice.dto.OrderSummaryDTO;
import com.core.warehouseservice.dto.ShipmentDTO;
import com.core.warehouseservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
public class OrdersController {

    private final OrderService orderService;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<OrderSummaryDTO>> getPickingList(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getPickingList(orgId));
    }

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable UUID orderId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getOrderDetails(orderId, orgId));
    }

    @PostMapping("/picking/packed/{id}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<OrderDTO>> markOrderAsPacked(@PathVariable UUID id, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markOrderAsPacked(id, orgId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/shipments")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ShipmentDTO>> getShipments(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getAllOrdersReadyForShipping(orgId));
    }

    @PostMapping("/shipments/shipped/{id}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> markShipmentAsShipped(@PathVariable UUID id, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markShipmentAsShipped(id, orgId);
        return ResponseEntity.ok().build();
    }

}
