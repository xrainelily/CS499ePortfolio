import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class TripData {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Retrieve all available trips.
  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  // Add a new trip.
  public addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.baseUrl}/trips`, formData);
  }

  // Retrieve one trip by its unique trip code.
  public getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips/${tripCode}`);
  }

  // Update an existing trip.
  public updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(
      `${this.baseUrl}/trips/${formData.code}`,
      formData
    );
  }
}
