package com.core.inventoryservice.repository;

import java.util.UUID;
import com.core.inventoryservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, UUID> {

}
