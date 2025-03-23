package br.com.clsystem.CLSystem.tools;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.clsystem.CLSystem.model.repositories.EmployeeRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final EmployeeRepository employeeRepository;
    
    public CustomUserDetailsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       return employeeRepository.findByDocument(username)
            .map(UserAuthenticated::new)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // return User.withUsername(employee.getDocument())
        //     .password(employee.getPassword()) // Deve estar criptografada no banco
        //     //.authorities(null) 
        //     .build();
    }
}