package com.tasktracker.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "gorevler")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String baslik;

    private String aciklama;

    private String durum;

    private String oncelik;

    private LocalDate sonTarih;

    public Task() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBaslik() {
        return baslik;
    }

    public void setBaslik(String baslik) {
        this.baslik = baslik;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }

    public String getDurum() {
        return durum;
    }

    public void setDurum(String durum) {
        this.durum = durum;
    }

    public String getOncelik() {
        return oncelik;
    }

    public void setOncelik(String oncelik) {
        this.oncelik = oncelik;
    }

    public LocalDate getSonTarih() {
        return sonTarih;
    }

    public void setSonTarih(LocalDate sonTarih) {
        this.sonTarih = sonTarih;
    }
}