// login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$')
        ]
      ]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      if (await this.authService.login(credentials)) {
        console.log('Login successful!');
        const redirectUrl = this.authService.redirectUrl || '/home';
        this.authService.redirectUrl = ''; 
        this.router.navigate([redirectUrl]);
      } else {
        console.log('Invalid credentials. Please try again.');
      }
    } else {
      console.log('Invalid form. Please check your inputs.');
    }
  }
}