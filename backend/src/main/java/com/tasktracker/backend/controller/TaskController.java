package com.tasktracker.backend.controller;

import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5174")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Tüm görevleri getir
    @GetMapping
    public List<Task> tumGorevleriGetir() {
        return taskService.tumGorevleriGetir();
    }

    // ID'ye göre tek bir görevi getir
    @GetMapping("/{id}")
    public ResponseEntity<Task> gorevGetir(@PathVariable Long id) {
        return taskService.gorevGetir(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Yeni görev oluştur
    @PostMapping
    public Task gorevEkle(@RequestBody Task task) {
        return taskService.gorevKaydet(task);
    }

    // Görev güncelle
    @PutMapping("/{id}")
    public ResponseEntity<Task> gorevGuncelle(
            @PathVariable Long id,
            @RequestBody Task yeniTask) {

        return taskService.gorevGetir(id)
                .map(mevcutTask -> {
                    mevcutTask.setBaslik(yeniTask.getBaslik());
                    mevcutTask.setAciklama(yeniTask.getAciklama());
                    mevcutTask.setDurum(yeniTask.getDurum());
                    mevcutTask.setOncelik(yeniTask.getOncelik());
                    mevcutTask.setSonTarih(yeniTask.getSonTarih());
                    Task guncellenenTask = taskService.gorevKaydet(mevcutTask);
                    return ResponseEntity.ok(guncellenenTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Görev sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> gorevSil(@PathVariable Long id) {

        if (taskService.gorevGetir(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        taskService.gorevSil(id);
        return ResponseEntity.noContent().build();
    }
}