package com.agileflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI agileFlowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgileFlow REST API")
                        .description("High-performance Agile project management API for Epics, Stories, Sprints, and Kanban boards.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("AgileFlow Team")
                                .url("https://github.com/tkrsatyam/agile-flow"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://github.com/tkrsatyam/agile-flow/blob/main/LICENSE")));
    }
}
