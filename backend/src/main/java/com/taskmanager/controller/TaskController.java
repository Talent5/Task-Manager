package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        List<TaskResponse> tasks = taskService.getAllTasksByUser(authentication.getName());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id, Authentication authentication) {
        TaskResponse task = taskService.getTaskById(id, authentication.getName());
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest, 
                                                   Authentication authentication) {
        log.info("Creating new task for user: {} with title: {}", authentication.getName(), taskRequest.getTitle());
        try {
            TaskResponse task = taskService.createTask(taskRequest, authentication.getName());
            log.info("Task created successfully with ID: {} for user: {}", task.getId(), authentication.getName());
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            log.error("Failed to create task for user: {}. Error: {}", authentication.getName(), e.getMessage());
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, 
                                                   @Valid @RequestBody TaskRequest taskRequest,
                                                   Authentication authentication) {
        log.info("Updating task ID: {} for user: {}", id, authentication.getName());
        try {
            TaskResponse task = taskService.updateTask(id, taskRequest, authentication.getName());
            log.info("Task ID: {} updated successfully for user: {}", id, authentication.getName());
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            log.error("Failed to update task ID: {} for user: {}. Error: {}", id, authentication.getName(), e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTask(@PathVariable Long id, Authentication authentication) {
        log.info("Deleting task ID: {} for user: {}", id, authentication.getName());
        try {
            taskService.deleteTask(id, authentication.getName());
            log.info("Task ID: {} deleted successfully for user: {}", id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Task deleted successfully!"));
        } catch (Exception e) {
            log.error("Failed to delete task ID: {} for user: {}. Error: {}", id, authentication.getName(), e.getMessage());
            throw e;
        }
    }
}