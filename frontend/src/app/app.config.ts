import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Convert class-based interceptor to functional interceptor
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('Auth Interceptor - Request URL:', req.url);
  console.log('Auth Interceptor - Token exists:', !!token);
  console.log('Auth Interceptor - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Auth Interceptor - Authorization header added');
    return next(authReq);
  }
  
  console.log('Auth Interceptor - No token, proceeding without auth header');
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
