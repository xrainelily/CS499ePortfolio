import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { ApiErrorHandler } from '../services/api-error-handler';
import { Favorites } from '../services/favorites';
import {
  TripSearchSort,
  TripSortOption,
} from '../services/trip-search-sort';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  displayedTrips: Trip[] = [];
  favoriteCodes: string[] = [];
  searchTerm = '';
  sortOption: TripSortOption = 'name-asc';
  message = '';

  constructor(
    private tripData: TripData,
    private router: Router,
    private authentication: Authentication,
    private errorHandler: ApiErrorHandler,
    private favoritesService: Favorites,
    private tripSearchSort: TripSearchSort
  ) {}

  public ngOnInit(): void {
    this.loadTrips();

    if (this.isLoggedIn()) {
      this.loadFavorites();
    }
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public applySearchAndSort(): void {
    const filteredTrips = this.tripSearchSort.searchTrips(
      this.trips,
      this.searchTerm
    );

    this.displayedTrips = this.tripSearchSort.sortTrips(
      filteredTrips,
      this.sortOption
    );
  }

  private loadTrips(): void {
    this.message = '';

    this.tripData.getTrips().subscribe({
      next: (trips: Trip[]) => {
        this.trips = trips;
        this.applySearchAndSort();
      },
      error: (error: HttpErrorResponse) => {
        this.message = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError('Trip Listing', error);
      },
    });
  }

  private loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (trips: Trip[]) => {
        this.favoriteCodes = trips.map((trip: Trip) => trip.code);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandler.logError('Favorite Trips', error);
      },
    });
  }
}
