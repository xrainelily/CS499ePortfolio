import { Injectable } from '@angular/core';
import { Trip } from '../models/trip';

export type TripSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';

@Injectable({
  providedIn: 'root',
})
export class TripSearchSort {
  // Search across several useful trip fields in one pass through the array.
  public searchTrips(trips: Trip[], searchTerm: string): Trip[] {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return [...trips];
    }

    return trips.filter((trip: Trip) => {
      const searchableValues = [
        trip.name,
        trip.code,
        trip.resort,
        trip.description,
      ];

      return searchableValues.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(normalizedTerm)
      );
    });
  }

  // Use merge sort so sorting remains O(n log n) as the trip list grows.
  public sortTrips(trips: Trip[], option: TripSortOption): Trip[] {
    const copy = [...trips];

    return this.mergeSort(copy, (left: Trip, right: Trip) =>
      this.compareTrips(left, right, option)
    );
  }

  private mergeSort(
    trips: Trip[],
    compare: (left: Trip, right: Trip) => number
  ): Trip[] {
    if (trips.length <= 1) {
      return trips;
    }

    const middle = Math.floor(trips.length / 2);
    const left = this.mergeSort(trips.slice(0, middle), compare);
    const right = this.mergeSort(trips.slice(middle), compare);

    return this.merge(left, right, compare);
  }

  private merge(
    left: Trip[],
    right: Trip[],
    compare: (left: Trip, right: Trip) => number
  ): Trip[] {
    const result: Trip[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (compare(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(
      left.slice(leftIndex),
      right.slice(rightIndex)
    );
  }

  private compareTrips(
    left: Trip,
    right: Trip,
    option: TripSortOption
  ): number {
    switch (option) {
      case 'name-desc':
        return right.name.localeCompare(left.name);

      case 'price-asc':
        return this.getNumericPrice(left) - this.getNumericPrice(right);

      case 'price-desc':
        return this.getNumericPrice(right) - this.getNumericPrice(left);

      case 'name-asc':
      default:
        return left.name.localeCompare(right.name);
    }
  }

  private getNumericPrice(trip: Trip): number {
    const parsedPrice = Number(
      String(trip.perPerson).replace(/[^0-9.-]+/g, '')
    );

    return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
  }
}
