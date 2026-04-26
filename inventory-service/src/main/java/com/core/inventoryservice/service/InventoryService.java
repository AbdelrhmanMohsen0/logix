package com.core.inventoryservice.service;

import java.util.ArrayList;
import java.util.List;
import com.core.inventoryservice.domain.OrderStatus;
import com.core.inventoryservice.dto.ConfirmedOrderDTO;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ItemDTO;
import com.core.inventoryservice.dto.OrderDTO;
import com.core.inventoryservice.dto.OrderStatusUpdateDTO;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.exception.ProductNotFoundException;
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
	public void validateOrder (OrderDTO order){
		// todo: implement this
		List<ProductDTO> products = new ArrayList<ProductDTO>();
		
		for(ItemDTO item :  order.items()){
			Product product = productRepo.getProductBySku(item.SKU())
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
