package com.core.inventoryservice.model;

import java.time.Instant;
import java.util.UUID;
import com.core.inventoryservice.domain.ProductStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Setter
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@NotNull
	@Column(nullable = false)
	private UUID orgId;
	
	@NotBlank
	@Column(nullable = false)
	private String name;
	
	@NotNull
	@Column(nullable = false, unique = true)
	private String sku;
	
	@NotNull
	@Min(0)
	@Column(nullable = false)
	private Integer quantity;
	
	@NotNull
	@Min(0)
	@Column(nullable = false)
	private Double price;
	
	@NotBlank
	@Column(nullable = false)
	private String location;
	
	@NotNull
	@Min(0)
	@Column(nullable = false)
	private Integer threshold;
	
	@CreatedDate
	@Column(nullable = false, updatable = false)
	private Instant createdAt;
	
	@LastModifiedDate
	private Instant updatedAt;
	
	@Transient
	public ProductStatus productStatus(){
		if (quantity == 0) {
			return ProductStatus.OUT_OF_STOCK;
		} else if (quantity < threshold) {
			return ProductStatus.LOW_STOCK;
		} else {
			return ProductStatus.IN_STOCK;
		}
	}
	
}
