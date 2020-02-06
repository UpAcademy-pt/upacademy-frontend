import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { AcademyService } from '../shared/services/academy.service';
import { ReplaySubject } from 'rxjs';
import { Account } from '../shared/models/account';
import { Academy } from '../shared/models/academy';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-my-academies',
  templateUrl: './my-academies.component.html',
  styleUrls: ['./my-academies.component.scss']
})
export class MyAcademiesComponent implements OnInit {

  private teacherUsers: User[];
  public teacherUsers$: ReplaySubject<User[]> = new ReplaySubject(1);
  public isCollapsed = true;
  public currentAccount: Account;
  public currentAccount$: ReplaySubject<Account>;
  public academies: Academy[] = [];
  public academy: Academy;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  private count = 0;

  constructor(

    private accountService: AccountService,
    private academyService: AcademyService,

  ) {
    this.currentAccount$ = this.accountService.currentAccount$;
    this.currentAccount$.subscribe((account) => {
      this.currentAccount = account;
      this.currentAccount.academyIds.forEach(element => {
        this.academyService.getbyId(element).subscribe((academy: any) => {
          this.academies.push(academy);
          this.count++;
          if (this.count === this.currentAccount.academyIds.length) {
            this.academy = this.academies[0];
            this.academy$.next(this.academy);
            this.getTeachers();
          }
        }
        );
      });
    });
  }

  ngOnInit() {
  }
  public getTeachers() {
    this.academy.moduleDTOs.forEach(module => {
      module.userTeacher = [];
      module.teacherIds.forEach(teacher => {
        this.accountService.getUserbyAccount(teacher).subscribe((userTeacher: User) => {
          module.userTeacher.push(userTeacher);
        });
      });
    });

  }

}
