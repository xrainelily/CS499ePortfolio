import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Authentication } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: Authentication) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Login and registration requests do not require an existing JWT.
    const isAuthenticationRequest =
      request.url.includes('/login') || request.url.includes('/register');

    const token = this.authenticationService.getToken();

    if (
      token &&
      this.authenticationService.isLoggedIn() &&
      !isAuthenticationRequest
    ) {
      const authenticatedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authenticatedRequest);
    }

    return next.handle(request);
  }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
