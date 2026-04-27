package com.core.inventoryservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, UUID> {
	
	Optional<List<Product>> findTop5ByNameContainingIgnoreCase(String name);
	
	Optional<Page<Product>> findAllByOrderByCreatedAtDesc(Pageable pageable);
	
	Product getProductById(UUID id);
	
	Optional<Product> findProductBySku(String sku);
}
