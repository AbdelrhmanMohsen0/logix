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
import com.core.inventoryservice.dto.ShipmentReceivedDTO;
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
	private final SNSPublisherService snsPublisherService;
	
	@Transactional
	public ProductDTO updateProduct(CreateProductRequest dto, UUID orgId) {
		Product product = productRepo.findProductBySku(dto.sku())
				.orElseThrow(() -> new ProductNotFoundException(dto.sku()));
		
		if(!product.getOrgId().equals(orgId)){
			throw new InvalidOrgIdException(orgId);
		}
		
		product.setName(dto.name());
		product.setSku(dto.sku());
		product.setQuantity(dto.quantity());
		product.setPrice(dto.price());
		product.setLocation(dto.location());
		product.setThreshold(dto.threshold());
		
		productRepo.save(product);
		return productMapper.toProductDTO(product);
	}
	
	@Transactional
	public void addShipment(AddingShipmentRequest shipmentRequest, UUID orgId){
		
		int totalNumberOfItems = 0;
		for(ShipmentItem item: shipmentRequest.items()){
			
			Product product = productRepo.findProductBySku(item.sku())
					.orElseThrow(() -> new ProductNotFoundException(item.sku()));
			
			if(!product.getOrgId().equals(orgId)){
				throw new InvalidOrgIdException(orgId);
			}
			
			product.setQuantity(product.getQuantity() + item.quantity());
			totalNumberOfItems += item.quantity();
			productRepo.save(product);
		}
		
		snsPublisherService.publishShipmentReceivedEvent(new ShipmentReceivedDTO(
				shipmentRequest.shipmentId(),
				shipmentRequest.supplierName(),
				totalNumberOfItems
		));
		
	}
	
	public List<ProductDTO> searchProducts(UUID orgId, String name){
		List<Product> products = productRepo.findTop5ByOrgIdAndNameContainingIgnoreCase(orgId, name);
		
		return products.stream().map(productMapper::toProductDTO).toList();
	}
	
	public Page<ProductDTO> findAllProducts(Pageable pageable, UUID orgId) {
		
		Page<Product> products = productRepo.findAllByOrgIdOrderByCreatedAtDesc(pageable, orgId);
		
		return products.map(productMapper::toProductDTO);
	}
	
	public ProductDTO createProduct(CreateProductRequest productRequest, UUID orgId){
		Product product = Product.builder()
				.orgId(orgId)
				.name(productRequest.name())
				.sku(productRequest.sku())
				.quantity(productRequest.quantity())
				.price(productRequest.price())
				.location(productRequest.location())
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
	public void validateOrder (OrderDTO order, UUID organizationId){
		List<ProductDTO> products = new ArrayList<>();
		List<Product> productsToSave = new ArrayList<>();
		
		for(ItemDTO item :  order.items()){
			Product product = productRepo.findProductBySku(item.SKU())
					.orElseThrow(() -> new ProductNotFoundException(item.SKU()));
			
			if(!product.getOrgId().equals(organizationId)){
				throw new InvalidOrgIdException(organizationId);
			}
			
			if(product.getQuantity() < item.quantity()){
				
				snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.id(), OrderStatus.CANCELED));
				
				return;
			} else {
				product.setQuantity(product.getQuantity() - item.quantity());
				productsToSave.add(product);
				products.add(productMapper.toProductDTO(product));
			}
		}
		
		productRepo.saveAll(productsToSave);
		
		ConfirmedOrderDTO confirmedOrder = ConfirmedOrderDTO.builder()
				.orderId(order.id())
				.orgId(order.organizationId())
				.customerName(order.customerName())
				.customerPhone(order.customerPhone())
				.customerAddress(order.customerAddress())
				.orderCurrentStatus(OrderStatus.CONFIRMED)
				.totalAmount(order.totalAmount())
				.products(products)
				.build();
		
		snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.id(), OrderStatus.CONFIRMED));
		snsPublisherService.publishInventoryAllocatedEvent(confirmedOrder);
		
	}
	
}
