package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.InboundShipmentDTO;
import com.core.warehouseservice.service.InboundShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouse/inbound")
public class InboundController {

    private final InboundShipmentService inboundShipmentService;

    @GetMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<InboundShipmentDTO>> getInboundShipments(JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        return ResponseEntity.ok(inboundShipmentService.getInboundShipments(orgId));
    }
}
