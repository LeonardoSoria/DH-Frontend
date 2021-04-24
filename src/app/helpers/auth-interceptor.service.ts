import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {AlertService} from '../ng-alerts/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor( private router: Router,
               private alertService: AlertService ) { }

  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const request = req;

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('error desde el interceptor', err);
        let errorMessage = '';

        switch ( err.status ) {
          case 401: { // unAuthorized
            this.alertService.error('No Autorizado', err.error.detail);
            localStorage.clear();
            this.router.navigateByUrl('/login');
            break;
          }
          case 400: case 404: case 204: { // badRequest, notFound, notContent
            this.alertService.error('Error', err.error.detail);
            break;
          }
          case 500: { // serverError
            this.alertService.error('Error del Servidor', 'Error interno del servidor');
            break;
          }
          default: {
            if (err.error instanceof ErrorEvent) {
              errorMessage = err.error.message;
            } else {
              errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
            }
            break;
          }
        }
        console.log('Errores desde Angular', errorMessage);
        return throwError( err );
      })
    );
  }
}
