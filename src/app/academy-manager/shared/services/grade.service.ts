import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grade } from '../models/grade';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private url = 'http://localhost:8080/coreFinalProject/academy-manager/grades/';
  private grades: Grade[];
  public grades$: ReplaySubject<Grade[]> = new ReplaySubject(1);

  constructor(
    private http: HttpClient
  ) {
    this.grades$.next(new Array<Grade>());
  }

  public getAllGrades() {
    return this.http.get(this.url);
  }

  public createGrade(grade: Grade) {
    return this.http.post(this.url, grade, {responseType: 'text'});
  }

  public getbyId(id: number) {
    return this.http.get(this.url + id);
  }

  public updateGrade(grade: Grade) {
    return this.http.put(this.url, grade, {responseType: 'text'});
  }

  public deleteGrade(id: number) {
    return this.http.delete(this.url + id, {responseType: 'text'});
  }
}
