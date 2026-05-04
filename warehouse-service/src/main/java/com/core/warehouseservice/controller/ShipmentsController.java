package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.ShipmentDTO;
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
@RequiredArgsConstructor
@RequestMapping("/warehouse/shipments")
public class ShipmentsController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<PagedModel<ShipmentDTO>> getShipments(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());

        Pageable pageable = PageRequest.of(page, size);
        Page<ShipmentDTO> shipmentDTOS = orderService.getAllOrdersReadyForShipping(pageable, orgId);

        return ResponseEntity.ok(new PagedModel<>(shipmentDTOS));

    }

    @PostMapping("/{shipmentId}/ship")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Void> markShipmentAsShipped(@PathVariable UUID shipmentId, JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        orderService.markShipmentAsShipped(shipmentId, orgId);
        return ResponseEntity.ok().build();
    }

}
