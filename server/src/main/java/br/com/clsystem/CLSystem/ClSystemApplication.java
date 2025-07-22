package br.com.clsystem.CLSystem;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClSystemApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
		SpringApplication.run(ClSystemApplication.class, args);
	}
	

}
