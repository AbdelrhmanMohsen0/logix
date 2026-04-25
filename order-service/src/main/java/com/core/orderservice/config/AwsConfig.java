package com.core.orderservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;

@Configuration
public class AwsConfig {
	
	@Bean
	public SqsClient sqsClient() {
		return SqsClient.builder()
				.region(Region.AP_EAST_1)// Set your desired region
				.build();
	}
}
