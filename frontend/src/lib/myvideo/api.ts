import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyVideosResponse } from './types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyVideosApiService {
  private apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getMyVideos(): Observable<MyVideosResponse> {
    return this.http.get<MyVideosResponse>(`${this.apiUrl}/my-videos`);
  }
} 