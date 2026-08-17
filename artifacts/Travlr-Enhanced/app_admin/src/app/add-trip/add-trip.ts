import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { TripData } from '../services/trip-data';
import { ApiErrorHandler } from '../services/api-error-handler';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTrip implements OnInit {
  addForm!: FormGroup;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData,
    private errorHandler: ApiErrorHandler
  ) {}

  public ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.addForm.invalid) {
      return;
    }

    this.tripService.addTrip(this.addForm.value).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        this.message = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError('Add Trip', error);
      },
    });
  }

  // Short name used by the template to access form controls.
  get f() {
    return this.addForm.controls;
  }
}
