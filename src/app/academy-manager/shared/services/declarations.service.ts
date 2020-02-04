import { Injectable } from '@angular/core';
import { Declarations } from '../models/declarations';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeclarationsService {

  public declarations: Declarations[];
  public declarations$: ReplaySubject<Declarations[]> = new ReplaySubject(1);

  readonly URL ="http://localhost:8080/coreFinalProject/academy-manager/declarations";

  constructor(
    private http: HttpClient,
  ) { }

  public get(accountId: number){
    return this.http.get(this.URL +"/account/" + accountId)
  }

  public create(mClass: Declarations){
    return this.http.post(this.URL +"/send/",mClass)
  }

  public delete(accountId: number){
    return this.http.delete(this.URL +"/" + accountId)
  }
  public update(mClass: Declarations){
    return this.http.put(this.URL +"/verify/" ,mClass)
  }

  // public update(mClass: Declarations){
  //   return this.http.put(this.URL +"/justify/",mClass)
  // }
}
