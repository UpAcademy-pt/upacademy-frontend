import { Injectable } from '@angular/core';
import { Module } from '../models/module';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private url = 'http://localhost:8080/coreFinalProject/academy-manager/modules/';
  private module: Module;
  public module$: ReplaySubject<Module> = new ReplaySubject(1);

  constructor(
    private http: HttpClient
  ) {
    this.module$.next(new Module());
  }

  public createModule(module: Module) {
    return this.http.post(this.url, module);
  }

  public getbyId(id: number) {
    return this.http.get(this.url + id);
  }

  public updateModule(module: Module) {
    return this.http.put(this.url, module);
  }

  public deleteModule(id: number) {
    return this.http.delete(this.url + id);
  }
}
