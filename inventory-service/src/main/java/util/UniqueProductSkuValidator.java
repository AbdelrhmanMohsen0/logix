package util;

import com.core.inventoryservice.repository.ProductRepo;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueProductSkuValidator implements ConstraintValidator<UniqueProductSku, String> {

    @Autowired
    private ProductRepo productRepo;

    @Override
    public boolean isValid(String sku, ConstraintValidatorContext context) {
        if (sku == null || sku.isEmpty()) return true;
        return !productRepo.existsBySku(sku);
    }
}
