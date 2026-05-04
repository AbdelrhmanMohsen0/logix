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
		Product product = productRepo.findProductBySkuAndOrgId(dto.sku(), orgId)
				.orElseThrow(() -> new ProductNotFoundException(dto.sku()));

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
			
			Product product = productRepo.findProductBySkuAndOrgId(item.sku(), orgId)
					.orElseThrow(() -> new ProductNotFoundException(item.sku()));

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
		Product product = productRepo.findProductBySkuAndOrgId(sku, orgId)
				.orElseThrow(() -> new ProductNotFoundException(sku));

		productRepo.delete(product);
	}
	
	@Transactional
	public void validateOrder(OrderDTO order, UUID organizationId){
		List<ProductDTO> orderItems = new ArrayList<>();
		List<Product> productsToSave = new ArrayList<>();
		
		for (ItemDTO item :  order.items()){
			Optional<Product> product = productRepo.findProductBySkuAndOrgId(item.sku(), organizationId);

			if (product.isEmpty()) {
				log.error("Product not found with SKU {}", item.sku());
				publishOrderCancelEvent(order);
				return;
			}

			if (product.get().getQuantity() < item.quantity()){
				publishOrderCancelEvent(order);
				return;
			}

			if (!product.get().getPrice().equals(item.priceAtPurchase())) {
				publishOrderCancelEvent(order);
				return;
			}

			product.get().setQuantity(product.get().getQuantity() - item.quantity());
			productsToSave.add(product.get());

			orderItems.add(ProductDTO.builder()
					.name(product.get().getName())
					.sku(product.get().getSku())
					.quantity(item.quantity().longValue())
					.price(product.get().getPrice())
					.location(product.get().getLocation())
					.stockStatus(product.get().getStockStatus())
					.build());
		}
		
		productRepo.saveAll(productsToSave);

		ConfirmedOrderDTO confirmedOrder = getConfirmedOrderDTO(order, organizationId, orderItems);

		snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CONFIRMED));
		snsPublisherService.publishInventoryAllocatedEvent(confirmedOrder);
	}

	private ConfirmedOrderDTO getConfirmedOrderDTO(OrderDTO order, UUID organizationId, List<ProductDTO> orderItems) {
		return ConfirmedOrderDTO.builder()
				.orderId(order.orderId())
				.orderDisplayIndex(order.orderDisplayIndex())
				.orgId(organizationId)
				.customerName(order.customerName())
				.customerPhone(order.customerPhone())
				.customerAddress(order.customerAddress())
				.orderCurrentStatus(OrderStatus.CONFIRMED)
				.totalAmount(order.totalAmount())
				.products(orderItems)
				.build();
	}

	private void validateSku(String sku, UUID orgId) {
		if (productRepo.existsBySkuAndOrgId(sku, orgId)) {
			throw new SkuAlreadyExistException("A product with sku " + sku + " already exists");
		}
	}
	
	private void publishOrderCancelEvent(OrderDTO order) {
		snsPublisherService.publishOrderStatusEvent(new OrderStatusUpdateDTO(order.orderId(), OrderStatus.CANCELED));
	}

}
