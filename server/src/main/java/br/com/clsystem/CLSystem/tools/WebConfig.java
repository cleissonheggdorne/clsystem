package br.com.clsystem.CLSystem.tools;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import br.com.clsystem.CLSystem.resolver.CurrentCustomerResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private CurrentCustomerResolver currentCustomerResolver;

    public WebConfig(CurrentCustomerResolver currentCustomerResolver) {
        this.currentCustomerResolver = currentCustomerResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentCustomerResolver);
    }
}