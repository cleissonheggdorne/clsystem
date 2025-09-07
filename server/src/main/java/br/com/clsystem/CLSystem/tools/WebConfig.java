package br.com.clsystem.CLSystem.tools;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import br.com.clsystem.CLSystem.resolver.CurrentCustomerResolver;
import br.com.clsystem.CLSystem.resolver.CurrentEmployeeArgumentResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final CurrentCustomerResolver currentCustomerResolver;
    private final CurrentEmployeeArgumentResolver currentEmployeeArgumentResolver;


    public WebConfig(CurrentCustomerResolver currentCustomerResolver,
                     CurrentEmployeeArgumentResolver currentEmployeeArgumentResolver) {
        this.currentCustomerResolver = currentCustomerResolver;
        this.currentEmployeeArgumentResolver = currentEmployeeArgumentResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentCustomerResolver);
        resolvers.add(currentEmployeeArgumentResolver);
    }
}