package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getAllTasksByUser(String username) {
        User user = getUserByUsername(username);
        List<Task> tasks = taskRepository.findByUserId(user.getId());
        
        log.debug("Retrieved {} tasks for user {}", tasks.size(), username);
        
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
        
        log.debug("Retrieved task {} for user {}", id, username);
        
        return mapToTaskResponse(task);
    }

    public TaskResponse createTask(TaskRequest taskRequest, String username) {
        User user = getUserByUsername(username);
        
        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        
        log.info("Created new task '{}' for user {}", task.getTitle(), username);
        
        return mapToTaskResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskRequest taskRequest, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());

        Task updatedTask = taskRepository.save(task);
        
        log.info("Updated task {} for user {}", id, username);
        
        return mapToTaskResponse(updatedTask);
    }

    public void deleteTask(Long id, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));

        taskRepository.delete(task);
        
        log.info("Deleted task {} for user {}", id, username);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}