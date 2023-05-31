import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackbar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
            case 500:
              this.snackbar.open(`Status code: ${error.status}`, 'Ok', {
                duration: 5000,
                panelClass: 'request-error',
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              break;
          }
        }

        return throwError(error);
      })
    );
  }
}
