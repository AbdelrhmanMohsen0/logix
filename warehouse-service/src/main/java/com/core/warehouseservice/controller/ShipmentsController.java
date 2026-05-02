package com.core.warehouseservice.controller;

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
@RequiredArgsConstructor
@RequestMapping("/warehouse/shipments")
public class ShipmentsController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ShipmentDTO>> getShipments(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(orderService.getAllOrdersReadyForShipping(orgId));
    }

    @PostMapping("/{shipmentId}/ship")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> markShipmentAsShipped(@PathVariable UUID shipmentId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markShipmentAsShipped(shipmentId, orgId);
        return ResponseEntity.ok().build();
    }

}
