package com.core.inventoryservice.controller;

import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.dto.AddingShipmentRequest;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inventory")
public class ProductController {
	
	private final InventoryService inventoryService;
	
	@PatchMapping("/stock")
	@PreAuthorize("hasRole('MANAGER')")
	public void addStock(@RequestBody AddingShipmentRequest shipmentRequest, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		inventoryService.addShipment(shipmentRequest, orgId);
	}
	
	@PutMapping("/products")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<ProductDTO> updateProduct(@RequestBody CreateProductRequest product, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return ResponseEntity.ok(inventoryService.updateProduct(product, orgId));
	}
	
	@GetMapping("/products")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<PagedModel<ProductDTO>> findAllProducts(
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			JwtAuthenticationToken auth
	) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		
		Pageable pageable = PageRequest.of(page, size);
		Page<ProductDTO> productDTOs = inventoryService.findAllProducts(pageable, orgId);
		
		return ResponseEntity.ok(new PagedModel<>(productDTOs));
	}
	
	@GetMapping("/products/search")
	@PreAuthorize("hasRole('WORKER') or hasRole('SALES')")
	public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String name, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return ResponseEntity.ok(inventoryService.searchProducts(orgId, name));
	}
	
	@PostMapping("/products")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody CreateProductRequest product, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		return ResponseEntity.ok(inventoryService.createProduct(product, orgId));
	}
	
	@DeleteMapping("/products/{sku}")
	@PreAuthorize("hasRole('MANAGER')")
	public void deleteProduct(@PathVariable String sku, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		inventoryService.deleteProduct(sku, orgId);
	}
}
