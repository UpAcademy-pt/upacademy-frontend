import { Component, OnInit } from '@angular/core';
import { Academy } from '../shared/models/academy';
import { ReplaySubject } from 'rxjs';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { AccountService } from '../shared/services/account.service';
import { Account } from '../shared/models/account';
import { AcademyService } from '../shared/services/academy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-academies',
  templateUrl: './teacher-academies.component.html',
  styleUrls: ['./teacher-academies.component.scss']
})
export class TeacherAcademiesComponent implements OnInit {

  public currentAccount: Account;
  public currentAccount$: ReplaySubject<Account> = new ReplaySubject(1);

  private academy: Academy;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  private academyIds: any[];
  private academies: Academy[] = [];
  public academies$: ReplaySubject<Academy[]> = new ReplaySubject(1);

  constructor(
    private userApi: UserServiceService,
    private accountApi: AccountService,
    private academyApi: AcademyService,
    private router: Router
  ) { 
    this.accountApi.currentAccount$.subscribe((account: Account) => {
      this.currentAccount = account;
      this.currentAccount$.next(this.currentAccount);
      this.academyIds = this.currentAccount.academyIds;
      console.log(this.currentAccount.academyIds);
      
      this.academyIds.forEach(academy => this.getActiveAcademies(academy));
      });  
  }

  ngOnInit() {
  }

public getActiveAcademies (academyId: number) {
  this. academyApi.getbyId(academyId).subscribe(
    (res: Academy) => {
      console.log(res);
      
      //  if (res.status !== 'NOTACTIVE') {    
        this.academies.push(res);
        this.academies$.next(this.academies);
      //  }
      console.log(this.academies);
    }
  )
}

public openAcademyById(id: number) {
  this.router.navigate(['academy-manager/academy-teacher/' + id]);
}

public openClassByAcademyId(id: number) {
  this.router.navigate(['academy-manager/academy-classroom/' + id]);
}

}
