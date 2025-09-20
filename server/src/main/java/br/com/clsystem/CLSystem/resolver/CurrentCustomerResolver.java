package br.com.clsystem.CLSystem.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String document = authentication.getName();
        return employeeRepository.findByDocumentAndDeletedAtIsNull(document)
                .map(Employee::getCustomer)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado para o funcionário"));
    }
}
