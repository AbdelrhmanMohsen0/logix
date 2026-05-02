package com.core.inventoryservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepo extends JpaRepository<Product, UUID> {
	
	@Query(value = "SELECT * FROM products p WHERE p.org_id = :orgId " +
			"AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
			"OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%'))) " +
			"LIMIT 5", nativeQuery = true)
	List<Product> searchTop5(UUID orgId, String query);

	Page<Product> findAllByOrgIdOrderByCreatedAtDesc(Pageable pageable, UUID orgId);
	
	Optional<Product> findProductBySku(String sku);

	boolean existsBySkuAndOrgId(String sku, UUID orgId);
}
