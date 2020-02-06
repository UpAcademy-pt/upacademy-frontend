import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { User } from 'src/app/core/models/user';
import { AccountService } from '../shared/services/account.service';
import { Router } from '@angular/router';
import { AcademyService } from '../shared/services/academy.service';
import { faSort, faEye } from '@fortawesome/free-solid-svg-icons';
import { Academy } from '../shared/models/academy';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']
})
export class AdminStudentsComponent implements OnInit {

  private studentUsers: User[];
  public studentUsers$: ReplaySubject<User[]> = new ReplaySubject(1);
  private studentUserAccounts: {}[] = [];
  public studentUserAccounts$: ReplaySubject<{}[]> = new ReplaySubject(1);
  private accountAcademies: string[] = [];
  private sortedByName = false;
  private filterSortedByName = false;
  private sortedByAcademy = false;
  private filterSortedByAcademy = false;
  public faEye = faEye;
  public faSort = faSort;
  public allAcademiesNames: {}[] = [{ 'id': 'Todas', 'text': 'Todas' }];
  private filteredStudents: {}[] = [];
  public nameFilter = '';
  public academyFilter = 'Todas';


  constructor(
    private accountService: AccountService,
    private userService: UserServiceService,
    private router: Router,
    private academyService: AcademyService
  ) {
    this.getAllStudents();
    this.getAllAcademies();
  }

  ngOnInit() {
  }

  public getAllStudents() {
    this.userService.getUsers('', '', 'USER').subscribe(
      (res: any) => {
        this.studentUsers = res;
        this.studentUsers$.next(res);
        this.studentUsers.forEach(student => this.getStudentAccount(student));
      }
    )
  }

  public getStudentAccount(studentUser: User) {
    this.accountService.getByUserId(studentUser.id).subscribe((account: any) => {
      if (account !== null) {
        let count = 0;
        for (const academyId of account.academyIds) {
          this.academyService.getbyId(academyId).subscribe(
            (res: any) => {
              count++;
              if (res !== null) {
                this.accountAcademies.push(res.edName);
              }
              if (count === account.academyIds.length) {
                this.studentUserAccounts.push({
                  'studentUser': studentUser,
                  'studentAccount': account, 'academyNames': this.accountAcademies
                });
                this.studentUserAccounts$.next(this.studentUserAccounts);
                this.accountAcademies = [];
              }
            }
          );
        }
        if (account.academyIds.length === 0) {
          this.studentUserAccounts.push({
            'studentUser': studentUser,
            'studentAccount': account, 'academyNames': []
          });
          this.studentUserAccounts$.next(this.studentUserAccounts);
        }
      }
    });
  }

  public showProfile(userId: number) {
    this.router.navigate(['/academy-manager/profile/' + userId]);
  }

  public getAcademy(id: number) {

  }

  public getAllAcademies() {
    this.academyService.getAllAcademies().subscribe(
      (academies: Academy[]) => {
        for (const academy of academies) {
          this.allAcademiesNames.push({ 'id': academy.edName, 'text': academy.edName });
        }
      }
    );
  }

  public sortTableByName() {
    if (this.nameFilter !== '' || this.academyFilter !== 'Todas') {
      if (this.filterSortedByName) {
        this.filteredStudents.reverse();
      } else {
        this.filteredStudents.sort((a, b) =>
          ((a['studentUser'].name === b['studentUser'].name) ? 0 : ((a['studentUser'].name > b['studentUser'].name) ? 1 : -1)));
        this.filterSortedByName = true;
        this.filterSortedByAcademy = false;
      }
      this.studentUserAccounts$.next(this.filteredStudents);
    } else {
      if (this.sortedByName) {
        this.studentUserAccounts.reverse();
      } else {
        this.studentUserAccounts.sort((a, b) =>
          ((a['studentUser'].name === b['studentUser'].name) ? 0 : ((a['studentUser'].name > b['studentUser'].name) ? 1 : -1)));
        this.sortedByName = true;
        this.sortedByAcademy = false;
      }
      this.studentUserAccounts$.next(this.studentUserAccounts);
    }
  }

  public sortTableByAcademy() {
    if (this.nameFilter !== '' || this.academyFilter !== 'Todas') {
      if (this.filterSortedByAcademy) {
        this.filteredStudents.reverse();
      } else {
        this.filteredStudents.sort((a, b) =>
          ((a['studentUser'].name === b['studentUser'].name) ? 0 : ((a['studentUser'].name > b['studentUser'].name) ? 1 : -1)));
        this.filterSortedByAcademy = true;
        this.filterSortedByName = false;
      }
      this.studentUserAccounts$.next(this.filteredStudents);
    } else {
      if (this.sortedByAcademy) {
        this.studentUserAccounts.reverse();
      } else {
        this.studentUserAccounts.sort((a, b) =>
          ((a['studentUser'].name === b['studentUser'].name) ? 0 : ((a['studentUser'].name > b['studentUser'].name) ? 1 : -1)));
        this.sortedByAcademy = true;
        this.sortedByName = false;
      }
      this.studentUserAccounts$.next(this.studentUserAccounts);
    }
  }

  public filterTable() {
    if (this.nameFilter !== '') {
      if (this.academyFilter !== 'Todas') {
        this.filteredStudents = this.studentUserAccounts.filter(
          student => student['studentUser'].name.toLowerCase().includes(this.nameFilter.toLowerCase())
            && student['academyNames'].includes(this.academyFilter));
        this.studentUserAccounts$.next(this.filteredStudents);
      } else {
        this.filteredStudents = this.studentUserAccounts.filter(student =>
          student['studentUser'].name.toLowerCase().includes(this.nameFilter.toLowerCase()));
        this.studentUserAccounts$.next(this.filteredStudents);
      }
    } else if (this.academyFilter !== 'Todas') {
      this.filteredStudents = this.studentUserAccounts.filter(student => student['academyNames'].includes(this.academyFilter));
      this.studentUserAccounts$.next(this.filteredStudents);
    } else {
      this.studentUserAccounts$.next(this.studentUserAccounts);
    }
  }

}
