package com.core.inventoryservice.mapper;

import java.util.List;
import com.core.inventoryservice.dto.CreateProductRequest;
import com.core.inventoryservice.dto.ProductDTO;
import com.core.inventoryservice.model.Product;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface ProductMapper{
    // This annotation is the "magic" that prevents overwriting data with nulls
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProductFromDto(CreateProductRequest dto, @MappingTarget Product entity);
    
    List<ProductDTO> toProductDTOs(List<Product> products);
    
    ProductDTO toProductDTO(Product product);
}
