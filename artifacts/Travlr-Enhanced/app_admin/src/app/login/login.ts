import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  formError = '';
  submitted = false;

  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authenticationService: Authentication
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    this.submitted = true;

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    this.doLogin();
  }

  private doLogin(): void {
    const user = {
      email: this.credentials.email,
    } as User;

    this.authenticationService
      .login(user, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: Error) => {
          this.formError = error.message;
        },
      });
  }
}
