package com.core.warehouseservice.service;

import com.core.warehouseservice.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class OrderLockCleanupTask {

    private final OrderRepository orderRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanUpStaleLocks() {
        orderRepository.releaseAllExpiredLocks(Instant.now());
    }
}
