package com.core.inventoryservice.service;

import java.util.Optional;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.OrderDTO;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.mapper.ProductMapper;
import com.core.inventoryservice.model.Product;
import com.core.inventoryservice.repository.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {
	
	private final ProductRepo productRepo;
	private final ProductMapper productMapper;
	
	public ProductDTO createProduct(CreateProductRequest productRequest){
		Product product = Product.builder()
				.name(productRequest.name())
				.sku(productRequest.sku())
				.quantity(productRequest.quantity())
				.price(productRequest.price())
				.threshold(productRequest.threshold())
				.build();
		
		productRepo.save(product);
		
		return productMapper.toProductDTO(product);
	}
	
	@Transactional
	public Optional<Product> validateOrder (OrderDTO order){
		// todo: implement this
		return Optional.of(Product.builder()
				.name("Test Product")
				.sku("TESTSKU")
				.quantity(100)
				.price(10.0)
				.threshold(10)
				.build());
	}
	
	private boolean validateSKU(String sku){
		// todo: fix this to validate SKUs using Product.equals()
		return true;
	}
}
