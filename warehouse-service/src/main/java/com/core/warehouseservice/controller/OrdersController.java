package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.OrderDTO;
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

    @GetMapping("/picking")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<OrderDTO>> getPickingList(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getAllOrders(orgId));
    }

    @GetMapping("/shipments")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<OrderDTO>> getShipments(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getAllOrders(orgId));
    }

    @PatchMapping("/shipments/{id}")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> markShipmentAsShipped(@PathVariable UUID id, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markShipmentAsShipped(id, orgId);
        return ResponseEntity.ok().build();
    }

}
