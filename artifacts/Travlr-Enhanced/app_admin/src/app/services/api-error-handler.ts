import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorHandler {
  // Convert HTTP failures into consistent messages that can be shown to users.
  public getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please try again later.';
    }

    if (error.status === 400) {
      return error.error?.message || 'The request could not be processed.';
    }

    if (error.status === 401) {
      return 'You are not authorized to perform this action.';
    }

    if (error.status === 404) {
      return 'The requested information could not be found.';
    }

    if (error.status >= 500) {
      return 'A server error occurred. Please try again later.';
    }

    return 'An unexpected error occurred.';
  }

  // Keep technical error details available to the developer without exposing them to users.
  public logError(context: string, error: HttpErrorResponse): void {
    console.error(`[${context}]`, {
      status: error.status,
      message: error.message,
      details: error.error,
    });
  }
}
