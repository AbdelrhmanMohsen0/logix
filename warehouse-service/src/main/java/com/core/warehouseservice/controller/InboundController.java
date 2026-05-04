package com.core.warehouseservice.controller;

import com.core.warehouseservice.dto.InboundShipmentDTO;
import com.core.warehouseservice.service.InboundShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouse/inbound")
public class InboundController {

    private final InboundShipmentService inboundShipmentService;

    @GetMapping
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<PagedModel<InboundShipmentDTO>> getInboundShipments(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            JwtAuthenticationToken auth) {
        UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
        Pageable pageable = PageRequest.of(page, size);
        Page<InboundShipmentDTO> shipments = inboundShipmentService.getInboundShipments(pageable, orgId);

        return ResponseEntity.ok(new PagedModel<>(shipments));
    }
}
