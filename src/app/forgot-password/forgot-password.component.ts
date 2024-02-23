import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      // Implement your forgot password logic here
      console.log('Forgot password email sent successfully!');
    } else {
      // Handle form errors or display a message
      console.log('Invalid form. Please check your email.');
    }
  }
}
