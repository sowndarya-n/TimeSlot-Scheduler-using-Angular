import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.router.navigate(['home']);
      console.log('Forgot password email sent successfully!');
    } else {
      
      console.log('Invalid form. Please check your email.');
    }
  }
}
