package com.tasktracker.backend.security;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.util.Base64;

import java.security.spec.MGF1ParameterSpec;

@Service
public class RsaPasswordCryptoService {

    private PrivateKey privateKey;
    private String publicKeyBase64;

    @PostConstruct
    public void init() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);

            KeyPair keyPair = generator.generateKeyPair();

            this.privateKey = keyPair.getPrivate();

            this.publicKeyBase64 = Base64.getEncoder()
                    .encodeToString(keyPair.getPublic().getEncoded());

        } catch (Exception e) {
            throw new IllegalStateException(
                    "RSA anahtarları oluşturulamadı.",
                    e
            );
        }
    }

    public String getPublicKeyBase64() {
        return publicKeyBase64;
    }

    public String decrypt(String encryptedPassword) {
        try {
            byte[] encryptedBytes =
                    Base64.getDecoder().decode(encryptedPassword);

            Cipher cipher =
                    Cipher.getInstance("RSA/ECB/OAEPPadding");

            OAEPParameterSpec oaepParameterSpec =
                    new OAEPParameterSpec(
                            "SHA-256",
                            "MGF1",
                            MGF1ParameterSpec.SHA256,
                            PSource.PSpecified.DEFAULT
                    );

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    privateKey,
                    oaepParameterSpec
            );

            byte[] decryptedBytes =
                    cipher.doFinal(encryptedBytes);

            return new String(
                    decryptedBytes,
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Şifre çözülemedi.",
                    e
            );
        }
    }
}