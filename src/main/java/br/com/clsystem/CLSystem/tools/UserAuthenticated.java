package br.com.clsystem.CLSystem.tools;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.clsystem.CLSystem.model.entities.Employee;

public class UserAuthenticated implements UserDetails{

    private final Employee employee;

    public UserAuthenticated(Employee employee){
        this.employee = employee;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(()-> "read");
    }

    @Override
    public String getPassword() {
       return employee.getPassword();
    }

    @Override
    public String getUsername() {
        return employee.getDocument();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
