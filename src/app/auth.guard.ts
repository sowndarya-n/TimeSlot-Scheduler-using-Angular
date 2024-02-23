// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticatedUser()) {
      // User is authenticated, allow access to the route
      return true;
    } else {
      // User is not authenticated, store the attempted URL for redirect after login
      this.authService.redirectUrl = state.url;
      // Redirect to the login page
      this.router.navigate(['']);
      return false;
    }
  }
}
