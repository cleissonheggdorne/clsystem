package br.com.clsystem.CLSystem.tools;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;

@Configuration
public class MessageSourceConfig {

    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages"); // ou o nome base dos seus arquivos de propriedades
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
}

