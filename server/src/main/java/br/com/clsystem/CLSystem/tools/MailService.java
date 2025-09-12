package br.com.clsystem.CLSystem.tools;

import java.util.logging.Logger;

import org.hibernate.validator.internal.util.logging.Log_.logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {
    final Logger logger = Logger.getLogger(MailService.class.getName());

    @Value("${spring.mail.username}")
    String username;

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String para, String assunto, String texto) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(this.username); 
        mensagem.setTo(para);
        mensagem.setSubject(assunto);
        mensagem.setText(texto);
        mailSender.send(mensagem);
    }

    public void sendEmailHtml(String para, String assunto, String texto) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            mimeMessage.setFrom(this.username);
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(para));
            mimeMessage.setSubject(assunto);
            mimeMessage.setContent(texto, "text/html; charset=utf-8");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
           logger.info("Erro ao enviar email HTML: " + e.getMessage());
        }
    }
    
}