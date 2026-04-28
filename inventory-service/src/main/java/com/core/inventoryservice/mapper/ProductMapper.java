package com.core.inventoryservice.mapper;

import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toProductDTO(Product product) {
        return ProductDTO.builder()
                .name(product.getName())
                .sku(product.getSku())
                .quantity(product.getQuantity())
                .price(product.getPrice())
                .location(product.getLocation())
                .stockStatus(product.getStockStatus())
                .build();
    }
}
