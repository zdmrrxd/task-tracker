package com.tasktracker.backend.security;

import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class RsaKeyService {

    private static final String TRANSFORMATION = "RSA/ECB/OAEPPadding";

    // Tarayıcının Web Crypto API'si RSA-OAEP + SHA-256 seçildiğinde hem OAEP hem de
    // MGF1 hash fonksiyonunu SHA-256 yapar. Java'da ise "OAEPWithSHA-256AndMGF1Padding"
    // yazmak MGF1'i varsayılan olarak SHA-1'de bırakır - bu yüzden ikisini de açıkça
    // SHA-256 olarak belirtmemiz gerekiyor, aksi halde şifre çözme işlemi başarısız olur.
    private static final OAEPParameterSpec OAEP_PARAMS = new OAEPParameterSpec(
            "SHA-256", "MGF1", new MGF1ParameterSpec("SHA-256"), PSource.PSpecified.DEFAULT
    );

    private final KeyPair keyPair;

    public RsaKeyService() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            this.keyPair = generator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException("RSA anahtar çifti oluşturulamadı.", ex);
        }
    }

    public String getPublicKeyBase64() {
        return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
    }

    public String decrypt(String base64CipherText) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate(), OAEP_PARAMS);
            byte[] decoded = Base64.getDecoder().decode(base64CipherText);
            byte[] plainBytes = cipher.doFinal(decoded);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Şifre çözümlenemedi. Lütfen tekrar deneyin.");
        }
    }

    public static PublicKey publicKeyFromBase64(String base64) throws Exception {
        byte[] bytes = Base64.getDecoder().decode(base64);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(bytes);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}