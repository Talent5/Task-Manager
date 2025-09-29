import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    console.log('Auth Interceptor - Request URL:', req.url);
    console.log('Auth Interceptor - Token exists:', !!token);
    console.log('Auth Interceptor - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Auth Interceptor - Authorization header added');
      return next.handle(authReq);
    }
    
    console.log('Auth Interceptor - No token, proceeding without auth header');
    return next.handle(req);
  }
}