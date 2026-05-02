package com.core.inventoryservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, UUID> {
	
	List<Product> findTop5ByOrgIdAndNameContainingIgnoreCase(UUID orgId, String name);
	
	Page<Product> findAllByOrgIdOrderByCreatedAtDesc(Pageable pageable, UUID orgId);
	
	Optional<Product> findProductBySku(String sku);

	boolean existsBySku(String sku);
}
