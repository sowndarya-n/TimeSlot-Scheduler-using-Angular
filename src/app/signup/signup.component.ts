import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
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

  signup() 
  {
    if (this.signupForm.valid) 
    {
      this.router.navigate(['home']);
      console.log('Signup successful!');
    } 
    else 
    {
      console.log('Signup failed!');
    }
  }

  private passwordsMatchValidator(group: FormGroup): null | { mismatch: true } 
  {
    const password = group.get('signupPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
