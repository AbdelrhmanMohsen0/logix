package com.core.inventoryservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import com.core.inventoryservice.dto.AddingShipmentRequest;
import com.core.inventoryservice.dto.ConfirmedOrderDTO;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ItemDTO;
import com.core.inventoryservice.dto.OrderDTO;
import com.core.inventoryservice.dto.OrderStatusUpdateDTO;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.dto.ShipmentItem;
import com.core.inventoryservice.exception.InvalidOrgIdException;
import com.core.inventoryservice.exception.ProductNotFoundException;
import com.core.inventoryservice.mapper.ProductMapper;
import com.core.inventoryservice.model.Product;
import com.core.inventoryservice.repository.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {
	
	private final ProductRepo productRepo;
	private final ProductMapper productMapper;
	
	@Transactional
	public void updateProduct(CreateProductRequest dto, UUID orgId) {
		Product product = productRepo.findProductBySku(dto.sku())
				.orElseThrow(() -> new ProductNotFoundException(dto.sku()));
		
		if(!product.getOrgId().equals(orgId)){
			throw new InvalidOrgIdException(orgId);
		}
		
		productMapper.updateProductFromDto(dto, product);
		
		productRepo.save(product);
	}
	
	@Transactional
	public void addShipment(AddingShipmentRequest shipmentRequest, UUID orgId){
		
		for(ShipmentItem item: shipmentRequest.items()){
			
			Product product = productRepo.findProductBySku(item.sku())
					.orElseThrow(() -> new ProductNotFoundException(item.sku()));
			
			if(!product.getOrgId().equals(orgId)){
				throw new InvalidOrgIdException(orgId);
			}
			
			product.setQuantity(product.getQuantity() + item.quantity());
			productRepo.save(product);
		}
	}
	
	public List<ProductDTO> searchProducts(String name){
		List<Product> products = productRepo.findTop5ByNameContainingIgnoreCase(name)
				.orElseThrow(() -> new ProductNotFoundException("Product not found"));
		
		return productMapper.toProductDTOs(products);
	}
	
	public Page<ProductDTO> findAllProducts(Pageable pageable, UUID orgId) {
		
		Page<Product> products = productRepo.findAllByOrderByCreatedAtDesc(pageable)
				.orElseThrow(() -> new ProductNotFoundException("Product not found"));
		
		products.getContent().forEach(product -> {if(!product.getOrgId().equals(orgId)){
			throw new InvalidOrgIdException(orgId);
		}});
		
		return products.map(productMapper::toProductDTO); //to return ProductDTO instead of Product
	}
	
	public ProductDTO createProduct(CreateProductRequest productRequest, UUID orgId){
		Product product = Product.builder()
				.orgId(orgId)
				.name(productRequest.name())
				.sku(productRequest.sku())
				.quantity(productRequest.quantity())
				.price(productRequest.price())
				.threshold(productRequest.threshold())
				.build();
		
		productRepo.save(product);
		
		return productMapper.toProductDTO(product);
	}
	
	public void deleteProduct(String sku, UUID orgId){
		Product product = productRepo.findProductBySku(sku)
				.orElseThrow(() -> new ProductNotFoundException(sku));
		
		if(!product.getOrgId().equals(orgId)){
			throw new InvalidOrgIdException(orgId);
		}
		
		productRepo.delete(product);
	}
	
	@Transactional
	public void validateOrder (OrderDTO order){
		// todo: implement this
		List<ProductDTO> products = new ArrayList<ProductDTO>();
		
		for(ItemDTO item :  order.items()){
			Product product = productRepo.findProductBySku(item.SKU())
					.orElseThrow(() -> new ProductNotFoundException(item.SKU()));
			
			if(product.getQuantity() < item.quantity()){
				OrderStatusUpdateDTO statusUpdateDTO =
						new OrderStatusUpdateDTO(order.id(), OrderStatus.CANCELED);
				
				// todo: publish this update
				
				return;
			} else {
				products.add(productMapper.toProductDTO(product));
			}
		}
		
		ConfirmedOrderDTO confirmedOrder = ConfirmedOrderDTO.builder()
				.customerName(order.customerName())
				.customerPhone(order.customerPhone())
				.customerAddress(order.customerAddress())
				.orderCurrentStatus(OrderStatus.CONFIRMED)
				.totalAmount(order.totalAmount())
				.products(products)
				.build();
		
		OrderStatusUpdateDTO statusUpdateDTO =
				new OrderStatusUpdateDTO(order.id(), OrderStatus.CANCELED);
		
		// todo: publish this update and publish the confirmed order
	}
	
}
