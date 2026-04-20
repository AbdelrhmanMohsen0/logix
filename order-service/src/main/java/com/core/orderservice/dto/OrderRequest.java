package com.core.orderservice.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record OrderRequest(
		@NotBlank String customerName,
		@NotBlank String customerPhone,
		@NotBlank String customerAddress,
		@NotEmpty List<@Valid ItemDTO> items
) {}
