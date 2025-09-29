import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control"
              [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            >
            <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              Username is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>
          
          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn btn-primary">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
        
        <p class="register-link">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
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
    
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #dc3545;
      text-align: center;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
    
    .register-link {
      text-align: center;
      margin-top: 1.5rem;
    }
    
    .register-link a {
      color: #007bff;
      text-decoration: none;
    }
    
    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid username or password';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}