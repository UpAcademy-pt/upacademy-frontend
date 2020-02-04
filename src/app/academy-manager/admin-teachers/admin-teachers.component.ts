import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { AccountService } from '../shared/services/account.service';
import { Router } from '@angular/router';
import { AcademyService } from '../shared/services/academy.service';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { Academy } from '../shared/models/academy';

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.scss']
})
export class AdminTeachersComponent implements OnInit {

  private teacherUsers: User[];
  public teacherUsers$: ReplaySubject<User[]> = new ReplaySubject(1);
  private teacherUserAccounts: {}[] = [];
  public teacherUserAccounts$: ReplaySubject<{}[]> = new ReplaySubject(1);
  private accountAcademies: string[] = [];
  private sorted = false;
  private filterSorted = false;
  public faSort = faSort;
  public allAcademiesNames: {}[] = [{ 'id': 'Todas', 'text': 'Todas' }];
  private filteredTeachers: {}[] = [];
  public nameFilter = '';
  public academyFilter = 'Todas';

  constructor(
    private userService: UserServiceService,
    private accountService: AccountService,
    private router: Router,
    private academyService: AcademyService
  ) {
    this.getAllTeachers();
    this.getAllAcademies();
  }

  ngOnInit() {
  }

  public getAllTeachers() {
    this.userService.getUsers('', '', 'SUPERUSER').subscribe(
      (res: any) => {
        this.teacherUsers = res;
        this.teacherUsers$.next(res);
        this.teacherUsers.forEach(teacher => this.getTeacherAccount(teacher));
      }
    );
  }

  public getTeacherAccount(teacherUser: User) {
    this.accountService.getByUserId(teacherUser.id).subscribe((account: any) => {
      if (account !== null) {
        for (const academyId of account.academyIds) {
          this.getAcademyById(academyId);
        }
        this.teacherUserAccounts.push({ 'teacherUser': teacherUser, 'teacherAccount': account, 'academyNames': this.accountAcademies });
        this.teacherUserAccounts$.next(this.teacherUserAccounts);
        this.accountAcademies = [];
      }
    });
  }

  public showProfile(userId: number) {
    this.router.navigate(['/academy-manager/profile/' + userId]);
  }

  public getAcademyById(id: number) {
    this.academyService.getbyId(id).subscribe(
      (res: any) => {
        if (res !== null) {
          this.accountAcademies.push(res.edName);
        }
      }
    );
  }

  public getAllAcademies() {
    this.academyService.getAllAcademies().subscribe(
      (academies: Academy[]) => {
        for (const academy of academies) {
          this.allAcademiesNames.push(academy.edName);
        }
      }
    );
  }

  public sortTable() {
    if (this.nameFilter !== '' || this.academyFilter !== 'Todas') {
      if (this.filterSorted) {
        this.filteredTeachers.reverse();
      } else {
        this.filteredTeachers.sort((a, b) =>
          ((a['teacherUser'].name === b['teacherUser'].name) ? 0 : ((a['teacherUser'].name > b['teacherUser'].name) ? 1 : -1)));
        this.sorted = true;
      }
      this.teacherUserAccounts$.next(this.filteredTeachers);
    } else {
      if (this.sorted) {
        this.teacherUserAccounts.reverse();
      } else {
        this.teacherUserAccounts.sort((a, b) =>
          ((a['teacherUser'].name === b['teacherUser'].name) ? 0 : ((a['teacherUser'].name > b['teacherUser'].name) ? 1 : -1)));
        this.sorted = true;
      }
      this.teacherUserAccounts$.next(this.teacherUserAccounts);
    }
  }

  public filterTable() {
    if (this.nameFilter !== '') {
      if (this.academyFilter !== 'Todas') {
        this.filteredTeachers = this.teacherUserAccounts.filter(
          teacher => teacher['teacherUser'].name.toLowerCase().includes(this.nameFilter.toLowerCase())
            && teacher['academyNames'].includes(this.academyFilter));
        this.teacherUserAccounts$.next(this.filteredTeachers);
      } else {
        this.filteredTeachers = this.teacherUserAccounts.filter(teacher =>
          teacher['teacherUser'].name.toLowerCase().includes(this.nameFilter.toLowerCase()));
        this.teacherUserAccounts$.next(this.filteredTeachers);
      }
    } else if (this.academyFilter !== 'Todas') {
      this.filteredTeachers = this.teacherUserAccounts.filter(teacher => teacher['academyNames'].includes(this.academyFilter));
      this.teacherUserAccounts$.next(this.filteredTeachers);
    } else {
      this.teacherUserAccounts$.next(this.teacherUserAccounts);
    }
  }
}
