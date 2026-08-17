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
import { Trip } from '../models/trip';
import { ApiErrorHandler } from '../services/api-error-handler';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';
  isError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripData,
    private errorHandler: ApiErrorHandler
  ) {}

  public ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.loadTrip(tripCode);
  }

  public onSubmit(): void {
    this.submitted = true;
    this.message = '';
    this.isError = false;

    if (this.editForm.invalid) {
      return;
    }

    this.tripDataService.updateTrip(this.editForm.value).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        this.isError = true;
        this.message = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError('Edit Trip - Update', error);
      },
    });
  }

  // Short name used by the template to access form controls.
  get f() {
    return this.editForm.controls;
  }

  private loadTrip(tripCode: string): void {
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (trips: Trip[]) => {
        if (trips.length === 0) {
          this.isError = true;
          this.message = 'The requested trip could not be found.';
          return;
        }

        this.trip = trips[0];
        this.editForm.patchValue(this.trip);
      },
      error: (error: HttpErrorResponse) => {
        this.isError = true;
        this.message = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError('Edit Trip - Retrieve', error);
      },
    });
  }
}
