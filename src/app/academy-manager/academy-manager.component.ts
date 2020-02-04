import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../core/services/user-service/user-service.service';
import { Router } from '@angular/router';
import { AccountService } from './shared/services/account.service';
import { Account } from './shared/models/account';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-academy-manager',
  templateUrl: './academy-manager.component.html',
  styleUrls: ['./academy-manager.component.scss']
})
export class AcademyManagerComponent implements OnInit {

  public showAdminSidebar: boolean = false;
  public currentAccount$: ReplaySubject<Account>;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.currentAccount$ = this.accountService.currentAccount$;
    if (this.userService.isAdmin()) {
      this.showAdminSidebar = true;
      this.router.navigate
      (['academy-manager/admin-academies']);
    } else if (this.userService.isSuperUser())  {
      this.router.navigate(['academy-manager/teacher-academies']);
    }
    else {
      this.router.navigate(['academy-manager/my-academies']);

    }
  }

  ngOnInit() {
  }

}

