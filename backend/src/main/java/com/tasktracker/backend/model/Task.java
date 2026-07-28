package com.tasktracker.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "gorevler")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Task title cannot be empty.")
    @Column(nullable = false)
    private String baslik;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    @Column(length = 500)
    private String aciklama;

    @NotBlank(message = "Status cannot be empty.")
    @Column(nullable = false)
    private String durum;

    @NotBlank(message = "Priority cannot be empty.")
    @Column(nullable = false)
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