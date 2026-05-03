package com.core.inventoryservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.core.inventoryservice.domain.OrderStatus;
import com.core.inventoryservice.domain.ProductStatus;
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
import com.core.inventoryservice.exception.SkuAlreadyExistException;
import com.core.inventoryservice.mapper.ProductMapper;
import com.core.inventoryservice.model.Product;
import com.core.inventoryservice.repository.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
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
		
		long totalNumberOfItems = 0L;
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
				orgId,
				shipmentRequest.shipmentId(),
				shipmentRequest.supplierName(),
				totalNumberOfItems
		));
		
	}
	
	public List<ProductDTO> searchProducts(UUID orgId, String query){
		List<Product> products = productRepo.searchTop5(orgId, query);
		
		return products.stream().map(productMapper::toProductDTO).toList();
	}
	
	public Page<ProductDTO> findAllProducts(Pageable pageable, UUID orgId, ProductStatus stockFilter) {
		Page<Product> products = productRepo.findAllByOrgIdAndStockStatus(pageable, orgId, stockFilter.name());
		
		return products.map(productMapper::toProductDTO);
	}
	
	public ProductDTO createProduct(CreateProductRequest productRequest, UUID orgId){
		validateSku(productRequest.sku(), orgId);

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
	public void validateOrder(OrderDTO order, UUID organizationId){
		List<ProductDTO> products = new ArrayList<>();
		List<Product> productsToSave = new ArrayList<>();
		
		for (ItemDTO item :  order.items()){

			Optional<Product> product = productRepo.findProductBySku(item.sku());

			if (product.isEmpty()) {
				log.error("Product not found with SKU {}", item.sku());
				snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CANCELED));
				return;
			}

			if (!product.get().getOrgId().equals(organizationId)){
				throw new InvalidOrgIdException(organizationId);
			}
			
			if (product.get().getQuantity() < item.quantity()){
				snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CANCELED));
				return;
			}

			if (!product.get().getPrice().equals(item.priceAtPurchase())) {
				snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CANCELED));
				return;
			}

			product.get().setQuantity(product.get().getQuantity() - item.quantity());
			productsToSave.add(product.get());
			products.add(productMapper.toProductDTO(product.get()));

		}
		
		productRepo.saveAll(productsToSave);
		
		ConfirmedOrderDTO confirmedOrder = ConfirmedOrderDTO.builder()
				.orderId(order.orderId())
				.orgId(organizationId)
				.customerName(order.customerName())
				.customerPhone(order.customerPhone())
				.customerAddress(order.customerAddress())
				.orderCurrentStatus(OrderStatus.CONFIRMED)
				.totalAmount(order.totalAmount())
				.products(products)
				.build();
		
		snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CONFIRMED));
		snsPublisherService.publishInventoryAllocatedEvent(confirmedOrder);
		
	}

	private void validateSku(String sku, UUID orgId) {
		if (productRepo.existsBySkuAndOrgId(sku, orgId)) {
			throw new SkuAlreadyExistException("A product with sku " + sku + " already exists");
		}
	}

}
