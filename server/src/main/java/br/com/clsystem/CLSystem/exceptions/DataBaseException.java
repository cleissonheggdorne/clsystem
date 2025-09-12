package br.com.clsystem.CLSystem.exceptions;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class DataBaseException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public DataBaseException(String message) {
        super(message);
    }

    public DataBaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public ResponseEntity<?> handleException() {
        if (getCause() instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) getCause();
            if (exception.getCause() instanceof ConstraintViolationException) {
                ConstraintViolationException constraintViolationException = (ConstraintViolationException) exception.getCause();
                String constraintName = constraintViolationException.getConstraintName();
                String message = constraintViolationException.getMessage();
                //Product
                if (constraintName.contains("bar_code")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de Barras Já Está Em Uso!");
                } else if (constraintName.contains("name_product")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome do Produto Já Está Em Uso!");
                } else if(message.contains("document") && message.contains("tb_employee")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Documento Já Está Em Uso!");
                } else if(message.contains("document") && message.contains("tb_customer")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empresa já cadastrada em nossa plataforma!");
                }else{
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro Desconhecido: contate o suporte técnico");
                }
            } else if (exception.getCause().toString().contains("value too long")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Há Campos Com Caracteres Acima do Permitido!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro desconhecido: contate o suporte técnico");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro desconhecido: contate o suporte técnico");
        }
    }
}
