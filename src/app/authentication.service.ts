// authentication.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated = false;
  public redirectUrl: string = ''; // Declare the redirectUrl property

  login(credentials: { email: string; password: string }): boolean {
    // Simulate authentication logic
    // Replace this with your actual authentication logic, e.g., API call
    if (this.isValidCredentials(credentials)) {
      this.isAuthenticated = true;
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.redirectUrl = '/';
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  private isValidCredentials(credentials: { email: string; password: string }): boolean {
    // Replace this with your actual validation logic, e.g., API call
    // For simplicity, I'm using hardcoded values for demonstration purposes
    return credentials.email === 'test@example.com' && credentials.password === 'Password123';
  }
}
