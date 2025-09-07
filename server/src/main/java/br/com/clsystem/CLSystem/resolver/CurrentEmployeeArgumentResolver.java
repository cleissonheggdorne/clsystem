package br.com.clsystem.CLSystem.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import br.com.clsystem.CLSystem.model.entities.Employee;
import br.com.clsystem.CLSystem.model.entities.annotation.CurrentEmployee;
import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;

@Component
public class CurrentEmployeeArgumentResolver implements HandlerMethodArgumentResolver {

    private final EmployeeRepository employeeRepository;

    public CurrentEmployeeArgumentResolver(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(Employee.class) && parameter.hasParameterAnnotation(CurrentEmployee.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String document = authentication.getName();
        return employeeRepository.findByDocument(document)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado para o usuário autenticado"));
    }
}
