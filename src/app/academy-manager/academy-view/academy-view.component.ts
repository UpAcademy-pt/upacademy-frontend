import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademyService } from '../shared/services/academy.service';
import { Academy } from '../shared/models/academy';
import { ReplaySubject } from 'rxjs';
import { BsModalService, BsModalRef, BsDropdownConfig } from 'ngx-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Module } from '../shared/models/module';
import { ThemesServiceService } from '../shared/services/themes-service.service';
import { Theme } from '../shared/models/theme';
import { ModuleService } from '../shared/services/module.service';
import { User } from 'src/app/core/models/user';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { AccountService } from '../shared/services/account.service';
import { Account } from '../shared/models/account';

@Component({
  selector: 'app-academy-view',
  templateUrl: './academy-view.component.html',
  styleUrls: ['./academy-view.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AcademyViewComponent implements OnInit {

  public students: any[] = [];
  public studentsIds2: any[] = [];

  private academy: Academy;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  public inUpdate = false;
  public dates: string;
  public datesArray: string[];
  private modalRef: BsModalRef;
  private currentDate = new Date();
  public newModule: Module = new Module();
  private allThemes: Theme[];
  public allThemes$: ReplaySubject<Theme[]> = new ReplaySubject(1);
  public themeDropdownList = [{ 'id': 0, 'name': 'Sem temas' }];
  public dropdownSettings = {
    dataIdProperty: 'id',
    dataNameProperty: 'name',
    headerText: 'Temas',
    noneSelectedBtnText: 'Nenhum seleccionado',
    btnWidth: 'auto',
    dropdownHeight: 'auto',
    showDeselectAllBtn: true,
    showSelectAllBtn: true,
    deselectAllBtnText: 'Desmarcar todos',
    selectAllBtnText: 'Seleccionar todos',
    btnClasses: 'dropdown-toggle form-control',
    selectionLimit: 100,
    enableFilter: true
  };
  public newTheme = new Theme();
  public addingTheme = false;

  public studentToAdd: {}[] = [];
  private studentsDropdown: {}[] = [];
  public studentsDropdown$: ReplaySubject<{}[]> = new ReplaySubject(1);
  private academyStudents: {}[] = [];
  public academyStudents$: ReplaySubject<{}[]> = new ReplaySubject(1);
  private accountAcademies: string[] = [];
  public studentDropdownList = [{ id: 0, name: 'Sem alunos' }];
  public studentsDropdownSettings = {
    dataIdProperty: 'id',
    dataNameProperty: 'name',
    headerText: 'Alunos',
    noneSelectedBtnText: 'Nenhum seleccionado',
    btnWidth: 'auto',
    dropdownHeight: 'auto',
    showDeselectAllBtn: true,
    showSelectAllBtn: true,
    deselectAllBtnText: 'Desmarcar todos',
    selectAllBtnText: 'Seleccionar todos',
    btnClasses: 'dropdown-toggle form-control',
    selectionLimit: 100,
    enableFilter: true
  };

  datesForm = new FormGroup({
    dateRange: new FormControl([
      new Date(),
      new Date(this.currentDate.setDate(this.currentDate.getDate() + 7))
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private academyService: AcademyService,
    private modalService: BsModalService,
    private themeService: ThemesServiceService,
    private moduleService: ModuleService,
    private userService: UserServiceService,
    private accountService: AccountService
  ) {
    this.route.params.subscribe(
      params => {
        this.academyService.getbyId(Number(params.academyId)).subscribe(
          (academy: Academy) => {
            this.academy = academy;
            this.academy$.next(this.academy);
            this.academy.studentsIds.forEach(student => {
            this.getStudentsByAcademy(student);
          });
          }
        );
      });
  }

  ngOnInit() {
  }

  public toggleUpdateAcademy() {
    this.inUpdate = true;
  }

  public getDates(dates: string, academy: Academy) {
    this.datesArray = dates.split(' - ');
    academy.startDate = this.datesArray[0];
    academy.endDate = this.datesArray[1];
  }

  public updateAcademy(dates: string) {
    this.getDates(dates, this.academy);
    this.academyService.updateAcademy(this.academy).subscribe(
      (msg: string) => {
        console.log(msg);
        this.inUpdate = false;
      }, (error: string) => {
        console.log(error);
      });
  }

  public updateAcademy2() {
    this.studentsIds2.forEach(numz => {
      this.academy.studentsIds.push(numz.id);
      this.getStudentsByAcademy(numz.id);
    });
    this.academyService.updateAcademy(this.academy).subscribe(
      (res: Academy) => {
        console.log(res);
        this.academy$.next(this.academy);
        this.modalRef.hide();
      });
  }

  public deleteAcademy() {
    this.academyService.deleteAcademy(this.academy.id).subscribe(
      (msg: string) => {
        console.log(msg);
        this.returnToTable();
      }, (error: string) => {
        console.log(error);
      });
  }

  public returnToTable() {
    this.router.navigate(['/academy-manager/admin-academies']);
  }

  public openModalConfirmDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public openModalAddModule(template: TemplateRef<any>) {
    this.getAllThemes();
    this.modalRef = this.modalService.show(template);
  }

  public showModule(moduleId: number) {
    this.router.navigate(['/academy-manager/academy/' + this.academy.id + '/module/' + moduleId]);
  }

  public addModuleToAcademy() {
    delete this.newModule.userTeacher;
    this.moduleService.createModule(this.newModule).subscribe(
      (id: number) => {
        this.newModule.id = id;
        this.academy.moduleDTOs.push(this.newModule);
        this.academy$.next(this.academy);
        this.academyService.updateAcademy(this.academy).subscribe(
          (res: any) => {
            this.modalRef.hide();
          }
        );
      }
    );
  }

  public getAllThemes() {
    this.themeService.getAll().subscribe(
      (res: any) => {
        this.allThemes = res;
        this.allThemes$.next(this.allThemes);
        if (this.allThemes !== []) {
          this.themeDropdownList = [];
        }
        this.allThemes.forEach(theme => {
          this.themeDropdownList.push({ 'id': theme.id, 'name': theme.name });
        });
      }
    );
  }

  public toggleAddTheme() {
    this.addingTheme = true;
  }

  public addTheme() {
    this.themeService.create(this.newTheme).subscribe(
      (res: any) => {
        console.log(res);
        this.getAllThemes();
      }
    );
  }

  public openModalAddStudent(template: TemplateRef<any>) {
    this.studentsDropdown = [];
    this.getAllStudentsNotinAcademy();
    this.modalRef = this.modalService.show(template);
  }

  public showStudent(studentId: number) {
    this.router.navigate(['/academy-manager/profile/' + studentId]);
  }

  public addStudentToAcademy() {
    this.academy.studentsIds = [];
    this.studentToAdd.forEach(student => this.academy.studentsIds.push(student['id']));
    this.modalRef.hide();
  }

  public getStudentsByAcademy(studentId: number) {
      this.accountService.getById(studentId).subscribe((account: Account) => {
        this.userService.getUserById(account.userId).subscribe(
          (studentUser: User) => {
            this.academyStudents.push({ 'studentUser': studentUser, 'studentAccount': account });
            this.academyStudents$.next(this.academyStudents);
          });
      });
  }

  public getAllStudents() {
    this.userService.getUsers('', '', 'USER').subscribe(
      (students: User[]) => {
        students.forEach(student => {
          this.getStudentAccount(student);
        });
      }
    );
  }

  public getAllStudentsNotinAcademy() {
    this.userService.getUsers('', '', 'USER').subscribe(
      (students: User[]) => {
        students.forEach(student => {
          this.getStudentAccountNotInAcademy(student);
        });
      }
    );
  }

  public getStudentAccountNotInAcademy(studentUser: User) {
    let ze: number[] = this.academy.studentsIds;
    this.accountService.getByUserId(studentUser.id).subscribe((account: Account) => {
      if (account !== null && (account.academyIds.length === 0 && (!ze.includes(account.id)))) {
        this.studentsDropdown.push({ 'id': account.id, 'name': studentUser.name });
        this.studentsDropdown$.next(this.studentsDropdown);
        console.log(this.studentsDropdown);
      }
    });
  }

  public getStudentAccount(studentUser: User) {
    this.accountService.getByUserId(studentUser.id).subscribe((account: Account) => {
      if (account !== null && (account.academyIds.length === 0 || account.academyIds.find(id => id === this.academy.id))) {
        this.studentsDropdown.push({ 'id': account.id, 'name': studentUser.name });
        this.studentsDropdown$.next(this.studentsDropdown);
      }
    });
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
}
