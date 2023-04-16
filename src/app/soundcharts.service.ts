import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundchartsService {

  BASE_URL = '';

  constructor(private http: HttpClient) {}
}
