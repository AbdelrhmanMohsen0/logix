package com.core.inventoryservice.repository;

import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, UUID> {
	
	Product getProductById(UUID id);
	
	Optional<Product> getProductBySku(String sku);
}
