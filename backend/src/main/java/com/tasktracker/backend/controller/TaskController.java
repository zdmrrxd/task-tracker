package com.tasktracker.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5175/")
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> tumGorevleriGetir() {
        return taskService.tumGorevleriGetir();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> gorevGetir(@PathVariable Long id) {
        return taskService.gorevGetir(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task gorevEkle(@Valid @RequestBody Task task) {
        return taskService.gorevKaydet(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> gorevGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody Task yeniTask) {

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> gorevSil(@PathVariable Long id) {

        if (taskService.gorevGetir(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        taskService.gorevSil(id);
        return ResponseEntity.noContent().build();
    }
}