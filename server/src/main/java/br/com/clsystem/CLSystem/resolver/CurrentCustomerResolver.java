package br.com.clsystem.CLSystem.resolver;

import java.security.Principal;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import br.com.clsystem.CLSystem.model.entities.Customer;
import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.annotation.CurrentCustomer;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;

@Component
public class CurrentCustomerResolver implements HandlerMethodArgumentResolver {

    private EmployeeRepository employeeRepository;

    public CurrentCustomerResolver(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(CurrentCustomer.class) != null 
            && parameter.getParameterType().equals(Customer.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, 
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {
        Principal principal = webRequest.getUserPrincipal();
        if (principal == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String document = principal.getName();
        return employeeRepository.findByDocument(document)
                .map(Employee::getCustomer)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado para o funcionário"));
    }
}

