import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Retrieve the complete trip records saved by the current user.
  public getFavorites(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/favorites`);
  }

  // Save a trip code to the current user's favorites array.
  public addFavorite(tripCode: string): Observable<{ favorites: string[] }> {
    return this.http.post<{ favorites: string[] }>(
      `${this.baseUrl}/favorites/${tripCode}`,
      {}
    );
  }

  // Remove a trip code from the current user's favorites array.
  public removeFavorite(tripCode: string): Observable<{ favorites: string[] }> {
    return this.http.delete<{ favorites: string[] }>(
      `${this.baseUrl}/favorites/${tripCode}`
    );
  }
}
