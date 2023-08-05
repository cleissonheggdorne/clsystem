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
                //Product
                if (constraintName.contains("bar_code")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de Barras Já Está Em Uso!");
                } else if (constraintName.contains("name_product")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome do Produto Já Está Em Uso!");
                } else if(constraintName.contains("document")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Documento Já Está Em Uso!");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro Desconhecido: (log)" + exception.getCause());
                }
            } else if (exception.getCause().toString().contains("value too long")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Há Campos Com Caracteres Acima do Permitido!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro desconhecido: (log) " + exception.getCause());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro desconhecido: (log)" + getCause());
        }
    }
}
