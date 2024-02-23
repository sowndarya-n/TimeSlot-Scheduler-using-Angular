import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      signupEmail: ['', [Validators.required, Validators.email]],
      signupPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$')
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  signup() {
    if (this.signupForm.valid) {
      // Implement your signup logic here
      console.log('Signup successful!');
    } else {
      // Handle form errors or display a message
      console.log('Invalid form. Please check your inputs.');
    }
  }

  private passwordsMatchValidator(group: FormGroup): null | { mismatch: true } {
    const password = group.get('signupPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }
}
