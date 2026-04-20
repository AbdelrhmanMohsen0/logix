package com.core.orderservice.service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import com.core.orderservice.domain.OrderStatus;
import com.core.orderservice.dto.ItemDTO;
import com.core.orderservice.dto.OrderDTO;
import com.core.orderservice.dto.OrderRequest;
import com.core.orderservice.dto.StatusHistoryDTO;
import com.core.orderservice.exception.OrderNotFoundException;
import com.core.orderservice.model.Item;
import com.core.orderservice.model.Order;
import com.core.orderservice.model.OrderStatusHistory;
import com.core.orderservice.repository.OrderRepo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
	
	private final OrderRepo orderRepo;
	
	@Transactional
	public OrderDTO createOrder(OrderRequest request) {
		Order order = new Order();
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
		
		OrderStatusHistory statusHistory = new OrderStatusHistory();
		statusHistory.setStatus(OrderStatus.CREATED);
		order.addStatusHistory(statusHistory);
		
		Order savedOrder = orderRepo.save(order);
		return toDetailDTO(savedOrder);
	}
	
	@Transactional
	public void changeStatus(UUID orderId,@Valid OrderStatus nextStatus) {
		Order order = orderRepo.findById(orderId)
				.orElseThrow(() -> new OrderNotFoundException(orderId));
	
		order.updateStatus(nextStatus);
		
		orderRepo.save(order);
	}
	
	private OrderDTO toDetailDTO(Order order) {
		// 1. Map and Sort Status History for the Timeline
		List<StatusHistoryDTO> historyDTOs = order.getStatusHistory().stream()
				.sorted(Comparator.comparing(OrderStatusHistory::getTransitionedAt))
				.map(h -> new StatusHistoryDTO(h.getStatus(), h.getTransitionedAt()))
				.toList();

		List<ItemDTO> itemDTOs = order.getItems().stream()
				.map(item -> new ItemDTO(
						item.getSKU(),
						item.getName(),
						item.getQuantity(),
						item.getPriceAtPurchase()
				))
				.toList();
		
		return new OrderDTO(
				order.getId(),
				order.getCustomerName(),
				order.getCustomerPhone(),
				order.getCustomerAddress(),
				order.getCurrentStatus(),
				order.getTotalAmount(),
				itemDTOs,
				historyDTOs
		);
	}
}
