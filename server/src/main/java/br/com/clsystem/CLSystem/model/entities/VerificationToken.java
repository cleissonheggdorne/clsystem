package br.com.clsystem.CLSystem.model.entities;

import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name="TB_VERIFICATION_TOKEN")
public class VerificationToken extends AuditableSoftDelete {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id_verification_token", updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

	@Column(name="email" , length = 120, nullable = false)
    private String email;

    @Column(name="token", length = 44, nullable = false)
    private String token;

    @Column(name="used", nullable = false)
    private boolean used;
}
