package com.core.inventoryservice.mapper;

import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toProductDTO(Product product) {
        return new ProductDTO(
                product.getName(),
                product.getSku(),
                product.getQuantity(),
                product.getPrice(),
                product.getThreshold()
        );
    }
}
