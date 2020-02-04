import { Injectable } from '@angular/core';
import { Missed } from '../models/missed';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MissedclassesService {

  public misses: Missed[];
  public misses$: ReplaySubject<Missed[]> = new ReplaySubject(1);

  readonly URL ="http://localhost:8080/coreFinalProject/academy-manager/missed";

  constructor(
    private http: HttpClient,
  ) {
    
   }

 public get(accountId: number){
    return this.http.get(this.URL +"/account/" + accountId)
  }
  public getByDate(date: string){
    return this.http.get(this.URL +"/date/" + date)
  }

  public create(mClass: Missed){
    return this.http.post(this.URL +"/m/",mClass)
  }

  public delete(accountId: number){
    return this.http.delete(this.URL +"/" + accountId)
  }

  public update(mClass: Missed){
    return this.http.put(this.URL +"/justify/",mClass)
  }
}
