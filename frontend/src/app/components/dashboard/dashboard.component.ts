import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService, Task, TaskRequest } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Task Manager</h1>
        <div class="user-info">
          <span>Welcome, {{ username }}!</span>
          <button (click)="logout()" class="btn btn-outline">Logout</button>
        </div>
      </header>

      <main class="main-content">
        <div class="task-form-section">
          <h2>Add New Task</h2>
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
            <div class="form-row">
              <div class="form-group">
                <label for="title">Task Title:</label>
                <input 
                  type="text" 
                  id="title" 
                  formControlName="title" 
                  class="form-control"
                  placeholder="Enter task title"
                  [class.is-invalid]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
                >
                <div class="invalid-feedback" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
                  Task title is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="description">Description (Optional):</label>
                <textarea 
                  id="description" 
                  formControlName="description" 
                  class="form-control"
                  placeholder="Enter task description"
                  rows="2"
                ></textarea>
              </div>
              
              <button type="submit" [disabled]="taskForm.invalid || loading" class="btn btn-primary">
                {{ loading ? 'Adding...' : 'Add Task' }}
              </button>
            </div>
          </form>
        </div>

        <div class="tasks-section">
          <h2>My Tasks</h2>
          
          <div class="task-filters">
            <button 
              (click)="filterTasks('ALL')" 
              [class.active]="currentFilter === 'ALL'"
              class="btn btn-filter"
            >
              All Tasks ({{ allTasks.length }})
            </button>
            <button 
              (click)="filterTasks('PENDING')" 
              [class.active]="currentFilter === 'PENDING'"
              class="btn btn-filter"
            >
              Pending ({{ getPendingCount() }})
            </button>
            <button 
              (click)="filterTasks('COMPLETED')" 
              [class.active]="currentFilter === 'COMPLETED'"
              class="btn btn-filter"
            >
              Completed ({{ getCompletedCount() }})
            </button>
          </div>

          <div class="tasks-list" *ngIf="filteredTasks.length > 0; else noTasks">
            <div class="task-card" *ngFor="let task of filteredTasks" [class.completed]="task.status === 'COMPLETED'">
              <div class="task-content" *ngIf="!task.editing">
                <div class="task-header">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <span class="task-status" [class.pending]="task.status === 'PENDING'" [class.completed]="task.status === 'COMPLETED'">
                    {{ task.status }}
                  </span>
                </div>
                <p class="task-description" *ngIf="task.description">{{ task.description }}</p>
                <div class="task-actions">
                  <button (click)="toggleTaskStatus(task)" class="btn btn-toggle">
                    {{ task.status === 'PENDING' ? 'Mark Complete' : 'Mark Pending' }}
                  </button>
                  <button (click)="editTask(task)" class="btn btn-edit">Edit</button>
                  <button (click)="deleteTask(task.id)" class="btn btn-danger">Delete</button>
                </div>
              </div>

              <div class="task-edit-form" *ngIf="task.editing">
                <form [formGroup]="editForm" (ngSubmit)="saveTask(task)">
                  <div class="form-group">
                    <input 
                      type="text" 
                      formControlName="title" 
                      class="form-control"
                      placeholder="Task title"
                    >
                  </div>
                  <div class="form-group">
                    <textarea 
                      formControlName="description" 
                      class="form-control"
                      placeholder="Task description"
                      rows="2"
                    ></textarea>
                  </div>
                  <div class="edit-actions">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" (click)="cancelEdit(task)" class="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <ng-template #noTasks>
            <div class="no-tasks">
              <p>{{ getNoTasksMessage() }}</p>
            </div>
          </ng-template>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      color: #333;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .task-form-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .task-form-section h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .task-form .form-row {
      display: grid;
      gap: 1rem;
      grid-template-columns: 2fr 3fr auto;
      align-items: end;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #555;
    }
    
    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .tasks-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .tasks-section h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .task-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #007bff;
      border-color: #007bff;
    }
    
    .btn-outline:hover {
      background-color: #007bff;
      color: white;
    }
    
    .btn-filter {
      background-color: #e9ecef;
      color: #495057;
      border-color: #e9ecef;
    }
    
    .btn-filter.active {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .btn-toggle {
      background-color: #28a745;
      color: white;
      border-color: #28a745;
    }
    
    .btn-edit {
      background-color: #ffc107;
      color: #212529;
      border-color: #ffc107;
    }
    
    .btn-danger {
      background-color: #dc3545;
      color: white;
      border-color: #dc3545;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border-color: #6c757d;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .tasks-list {
      display: grid;
      gap: 1rem;
    }
    
    .task-card {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      transition: transform 0.2s;
    }
    
    .task-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .task-card.completed {
      opacity: 0.7;
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .task-title {
      margin: 0;
      color: #333;
    }
    
    .task-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .task-status.pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .task-status.completed {
      background-color: #d4edda;
      color: #155724;
    }
    
    .task-description {
      color: #666;
      margin: 0.5rem 0;
    }
    
    .task-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .task-edit-form {
      display: grid;
      gap: 1rem;
    }
    
    .edit-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .no-tasks {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }
    
    @media (max-width: 768px) {
      .task-form .form-row {
        grid-template-columns: 1fr;
      }
      
      .main-content {
        padding: 1rem;
      }
      
      .header {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .task-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentFilter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';
  loading = false;

  taskForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
    
    // Debug: Check if token exists
    const token = this.authService.getToken();
    console.log('Dashboard ngOnInit - Token exists:', !!token);
    console.log('Dashboard ngOnInit - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    
    // Add a small delay to ensure token is available
    setTimeout(() => {
      this.loadTasks();
    }, 100);
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.allTasks = tasks;
        this.filterTasks(this.currentFilter);
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      const taskRequest: TaskRequest = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: 'PENDING'
      };

      this.taskService.createTask(taskRequest).subscribe({
        next: (task: Task) => {
          this.allTasks.unshift(task);
          this.filterTasks(this.currentFilter);
          this.taskForm.reset();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error creating task:', error);
          this.loading = false;
        }
      });
    }
  }

  filterTasks(filter: 'ALL' | 'PENDING' | 'COMPLETED'): void {
    this.currentFilter = filter;
    if (filter === 'ALL') {
      this.filteredTasks = [...this.allTasks];
    } else {
      this.filteredTasks = this.allTasks.filter(task => task.status === filter);
    }
  }

  toggleTaskStatus(task: Task): void {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    const updateRequest: TaskRequest = {
      title: task.title,
      description: task.description,
      status: newStatus
    };

    this.taskService.updateTask(task.id, updateRequest).subscribe({
      next: (updatedTask: Task) => {
        const index = this.allTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.allTasks[index] = updatedTask;
          this.filterTasks(this.currentFilter);
        }
      },
      error: (error: any) => {
        console.error('Error updating task:', error);
      }
    });
  }

  editTask(task: Task): void {
    task.editing = true;
    this.editForm.patchValue({
      title: task.title,
      description: task.description
    });
  }

  saveTask(task: Task): void {
    if (this.editForm.valid) {
      const updateRequest: TaskRequest = {
        title: this.editForm.value.title,
        description: this.editForm.value.description,
        status: task.status
      };

      this.taskService.updateTask(task.id, updateRequest).subscribe({
        next: (updatedTask: Task) => {
          const index = this.allTasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.allTasks[index] = { ...updatedTask, editing: false };
            this.filterTasks(this.currentFilter);
          }
        },
        error: (error: any) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  cancelEdit(task: Task): void {
    task.editing = false;
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.allTasks = this.allTasks.filter(task => task.id !== taskId);
          this.filterTasks(this.currentFilter);
        },
        error: (error: any) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  getPendingCount(): number {
    return this.allTasks.filter(task => task.status === 'PENDING').length;
  }

  getCompletedCount(): number {
    return this.allTasks.filter(task => task.status === 'COMPLETED').length;
  }

  getNoTasksMessage(): string {
    switch (this.currentFilter) {
      case 'PENDING':
        return 'No pending tasks. Great job!';
      case 'COMPLETED':
        return 'No completed tasks yet.';
      default:
        return 'No tasks yet. Create your first task above!';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}