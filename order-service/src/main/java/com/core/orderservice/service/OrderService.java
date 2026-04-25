package com.core.orderservice.service;

import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import com.core.orderservice.dto.ItemDTO;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.dto.OrderStatusUpdateDTO;
import com.core.orderservice.dto.OrderSummaryDTO;
import com.core.orderservice.exception.OrderNotFoundException;
import com.core.orderservice.mapper.OrderMapper;
import com.core.orderservice.model.Item;
import com.core.orderservice.model.Order;
import com.core.orderservice.model.OrderStatusState;
import com.core.orderservice.repository.OrderRepo;
import io.awspring.cloud.sqs.annotation.SqsListener;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
	
	private final OrderRepo orderRepo;
	private final OrderMapper orderMapper;
	private final SNSPublisherService  snsPublisherService;
	
	@Transactional
	public OrderDTO createOrder(OrderRequest request, UUID organizationId) {
		Order order = new Order();
		order.setOrganizationId(organizationId);
		order.setCustomerName(request.customerName());
		order.setCustomerPhone(request.customerPhone());
		order.setCustomerAddress(request.customerAddress());
		for (ItemDTO itemDto : request.items()) {
			Item item = new Item();
			item.setSKU(itemDto.SKU());
			item.setName(itemDto.name());
			item.setQuantity(itemDto.quantity());
			item.setPriceAtPurchase(itemDto.priceAtPurchase());
			order.addItem(item);
		}
		
		order.setCurrentStatus(OrderStatus.CREATED);
		
		OrderStatusState newState = new OrderStatusState();
		newState.setOrder(order);
		newState.setStatus(OrderStatus.CREATED);
		order.addStatusHistory(newState);
		
		Order savedOrder = orderRepo.save(order);
		
		OrderDTO orderDTO = orderMapper.toOrderDTO(savedOrder);
		snsPublisherService.publishOrderCreatedEvent(orderDTO);

		return orderDTO;
	}
	
//	@Transactional
//	protected void changeStatus(@Valid OrderStatusUpdateDTO statusUpdateDTO) {
//		Order order;
//		try {
//			order = orderRepo.findByOrderId(statusUpdateDTO.orderId());
//		} catch (OrderNotFoundException e) {
//			throw new OrderNotFoundException(statusUpdateDTO.orderId());
//		}
//		order.updateStatus(statusUpdateDTO);
//		orderRepo.save(order);
//	}
	
	public List<OrderSummaryDTO> getOrderSummaries(UUID organizationId) {
		return orderRepo.findAllSummariesByOrg(organizationId);
	}
	
	public OrderDTO getOrder(UUID orgId, UUID orderId) {
		Order order = orderRepo.getOrderByOrganizationIdAndOrderId(orgId, orderId)
				.orElseThrow(() -> new OrderNotFoundException(orderId));

		return orderMapper.toOrderDTO(order);
	}
	
//	@SqsListener("OrderServiceQueue.fifo")
//	public void listen(OrderStatusUpdateDTO message) {
//		changeStatus(message);
//
//		//todo: remove this after testing
//		System.out.println("Received: " + message);
//	}
}
