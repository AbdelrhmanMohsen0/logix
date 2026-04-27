package com.core.inventoryservice.controller;

import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("inventory/products")
public class ProductController {
	
	private final InventoryService inventoryService;
	
	//todo: add PreAuthorize to unauthorized endpoints
	
	@PatchMapping
	public void updateProduct(@RequestBody CreateProductRequest product, JwtAuthenticationToken auth) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		inventoryService.updateProduct(product, orgId);
	}
	
	@GetMapping
	public PagedModel<ProductDTO> findAllProducts(
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			JwtAuthenticationToken auth
	) {
		UUID orgId = UUID.fromString(auth.getTokenAttributes().get("org").toString());
		
		Pageable pageable = PageRequest.of(page, size);
		Page<ProductDTO> productDTOs = inventoryService.findAllProducts(pageable, orgId);
		
		return new PagedModel<>(productDTOs);
	}
	
	@GetMapping("/search")
	public List<ProductDTO> searchProducts(@RequestParam String name) {
		return inventoryService.searchProducts(name);
	}
	
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
