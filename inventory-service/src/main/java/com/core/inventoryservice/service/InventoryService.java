package com.core.inventoryservice.service;

import com.core.inventoryservice.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {
	
	private final ProductRepo productRepo;
	
}
