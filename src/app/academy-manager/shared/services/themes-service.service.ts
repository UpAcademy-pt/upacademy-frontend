import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemesServiceService {

  private url = 'http://localhost:8080/coreFinalProject/academy-manager/themes/';

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get(this.url);
  }

  public create(theme: Theme) {
    return this.http.post(this.url, theme);
  }

  public update(theme: Theme) {
    return this.http.put(this.url, theme);
  }

  public getById(id: number) {
    return this.http.get(this.url + id);
  }

  public delete(id: number) {
    return this.http.delete(this.url + id);
  }
}
