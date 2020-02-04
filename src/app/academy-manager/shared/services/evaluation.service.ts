import { Injectable } from '@angular/core';
import { Evaluation } from '../models/evaluation';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private url = 'http://localhost:8080/coreFinalProject/academy-manager/evaluations/';
  private evaluations: Evaluation[];
  public evaluations$: ReplaySubject<Evaluation[]> = new ReplaySubject(1);

  constructor(
    private http: HttpClient
  ) {
    this.evaluations$.next(new Array<Evaluation>());
  }

  public getAllEvaluations() {
    return this.http.get(this.url);
  }

  public createEvaluation(evaluation: Evaluation) {
    return this.http.post(this.url, evaluation);
  }

  public getbyId(id: number) {
    return this.http.get(this.url + id);
  }

  public updateEvaluation(evaluation: Evaluation) {
    return this.http.put(this.url, evaluation);
  }

  public deleteEvaluation(id: number) {
    return this.http.delete(this.url + id);
  }

}
