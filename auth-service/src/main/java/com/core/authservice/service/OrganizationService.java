package com.core.authservice.service;

import com.core.authservice.domain.Organization;
import com.core.authservice.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public Organization createNewOrganization(String organizationName) {
        return organizationRepository.save(Organization.builder()
                .name(organizationName)
                .build());
    }

    public Organization getReferenceById(UUID id) {
        return organizationRepository.getReferenceById(id);
    }

}
