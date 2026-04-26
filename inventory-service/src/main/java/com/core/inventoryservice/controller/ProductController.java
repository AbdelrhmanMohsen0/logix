package com.core.inventoryservice.controller;

import java.util.UUID;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("inventory/products")
public class ProductController {
	
	private final InventoryService inventoryService;
	
	@PostMapping
	@PreAuthorize("hasRole('MANAGER')")
	public ProductDTO createProduct(@Valid @RequestBody CreateProductRequest product, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return inventoryService.createProduct(product, orgId);
	}
	
	@DeleteMapping
	@PreAuthorize("hasRole('MANAGER')")
	public void deleteProduct(@Valid @RequestBody String sku, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		inventoryService.deleteProduct(sku, orgId);
	}
}
