import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CustomerAttributesService {
  private FQDN: string = '';

  constructor(
    private httpClient: HttpClient,
  ) { }

  setFQDN(fqdn: string) {
    this.FQDN = fqdn;
    console.log('FQDN set in service:', this.FQDN);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }

  getCcmChannels(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.FQDN}/ccm/channel-types`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(catchError(this.handleError));
  }
}
