import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'http://localhost:3000/api/generate-script'; // URL da sua API NestJS

  constructor(private http: HttpClient) { }

  generateScript(formData: any): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, formData, { headers, responseType: 'text' });
  }
}