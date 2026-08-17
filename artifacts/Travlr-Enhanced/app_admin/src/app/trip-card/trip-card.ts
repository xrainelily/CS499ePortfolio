import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';
import { Favorites } from '../services/favorites';
import { ApiErrorHandler } from '../services/api-error-handler';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard implements OnChanges {
  @Input() trip!: Trip;
  @Input() favoriteCodes: string[] = [];

  isFavorite = false;
  favoriteMessage = '';

  constructor(
    private router: Router,
    private authentication: Authentication,
    private favoritesService: Favorites,
    private errorHandler: ApiErrorHandler
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['favoriteCodes'] || changes['trip']) {
      this.isFavorite = this.favoriteCodes.includes(this.trip?.code);
    }
  }

  public editTrip(trip: Trip): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public toggleFavorite(): void {
    this.favoriteMessage = '';

    const request = this.isFavorite
      ? this.favoritesService.removeFavorite(this.trip.code)
      : this.favoritesService.addFavorite(this.trip.code);

    request.subscribe({
      next: (response: { favorites: string[] }) => {
        this.isFavorite = response.favorites.includes(this.trip.code);
      },
      error: (error: HttpErrorResponse) => {
        this.favoriteMessage = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError('Favorite Trip', error);
      },
    });
  }
}
