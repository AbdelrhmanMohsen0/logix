package com.core.inventoryservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepo extends JpaRepository<Product, UUID> {
	
	@Query(value = "SELECT * FROM products p WHERE p.org_id = :orgId " +
			"AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
			"OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%'))) " +
			"LIMIT 5", nativeQuery = true)
	List<Product> searchTop5(UUID orgId, String query);

	@Query("SELECT p FROM Product p WHERE p.orgId = :orgId AND (" +
			":status = 'ALL' OR " +
			"(:status = 'OUT_OF_STOCK' AND p.quantity = 0) OR " +
			"(:status = 'LOW_STOCK' AND p.quantity > 0 AND p.quantity < p.threshold) OR " +
			"(:status = 'IN_STOCK' AND p.quantity >= p.threshold)) " +
			"ORDER BY p.createdAt DESC")
	Page<Product> findAllByOrgIdAndStockStatus(
			Pageable pageable,
			@Param("orgId") UUID orgId,
			@Param("status") String status
	);
	
	Optional<Product> findProductBySku(String sku);

	boolean existsBySkuAndOrgId(String sku, UUID orgId);
}
