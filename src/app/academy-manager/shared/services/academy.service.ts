import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Academy } from '../models/academy';
import { ReplaySubject } from 'rxjs';
import { AccountService } from './account.service';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AcademyService {

  private url = 'http://localhost:8080/coreFinalProject/academy-manager/academies/';
  private accountAcademies: Academy[] = [];
  public accountAcademies$: ReplaySubject<Academy[]> = new ReplaySubject(1);

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.getCurrentAccountAcademies();
  }

  public getCurrentAccountAcademies() {
    this.accountService.currentAccount$.subscribe(
      (currentAccount: Account) => {
        currentAccount.academyIds.forEach(academyId => {
          this.getbyId(academyId).subscribe(
            (academy: Academy) => {
              this.accountAcademies.push(academy);
              this.accountAcademies$.next(this.accountAcademies);
            }
          );
        });
      }
    );
  }

  public getAllAcademies() {
    return this.http.get(this.url);
  }

  public createAcademy(academy: Academy) {
    return this.http.post(this.url, academy);
  }

  public getbyId(id: number) {
    return this.http.get(this.url + id);
  }

  public updateAcademy(academy: Academy) {
    return this.http.put(this.url, academy);
  }

  public deleteAcademy(id: number) {
    return this.http.delete(this.url + id);
  }

}
