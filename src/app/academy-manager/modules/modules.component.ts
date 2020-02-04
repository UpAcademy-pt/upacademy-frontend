import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { ModuleService } from '../shared/services/module.service';
import { EvaluationService } from '../shared/services/evaluation.service';
import { GradeService } from '../shared/services/grade.service';
import { Module } from '../shared/models/module';
import { Evaluation } from '../shared/models/evaluation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Grade } from '../shared/models/grade';
import { ThemesServiceService } from '../shared/services/themes-service.service';
import { Theme } from '../shared/models/theme';
import { AccountService } from '../shared/services/account.service';
import { Account } from '../shared/models/account';
import { AcademyService } from '../shared/services/academy.service';
import { Academy } from '../shared/models/academy';
import { faEdit, faTrashAlt, faClipboardList, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  private students: {}[] = [];
  public students$: ReplaySubject<{}[]> = new ReplaySubject(1);
  private module: Module;
  private module$: ReplaySubject<Module> = new ReplaySubject(1);
  private evaluations: Evaluation[] = [];
  public evaluations$: ReplaySubject<Evaluation[]> = new ReplaySubject(1);
  public evaluationToEdit = new Evaluation();
  public studentToEvaluate: string;
  private teachers: {}[] = [];
  public teachers$: ReplaySubject<{}[]> = new ReplaySubject(1);
  public showTable = false;
  public inUpdate = false;
  private allThemes: Theme[];
  public allThemes$: ReplaySubject<Theme[]> = new ReplaySubject(1);
  public themeDropdownList = [{ 'id': 0, 'name': 'Sem temas' }];
  public moduleThemeDropdownList = [{ 'id': 0, 'text': 'Todos os Temas' }];
  public dropdownSettings = {
    dataIdProperty: 'id',
    dataNameProperty: 'name',
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
  private modalRef: BsModalRef;
  private academyId: number;
  public evaluationField = '';
  public evaluationSubjectArray: string[] = [];
  private tableHeaders: string[] = ['Formando', 'Comentário'];
  public tableHeaders$: ReplaySubject<string[]> = new ReplaySubject(1);
  private tableRows: {}[] = [];
  public tableRows$: ReplaySubject<{}[]> = new ReplaySubject(1);
  public isSuperUser: boolean;
  private index: number;
  private allTeachers: {}[] = [];
  public allTeachers$: ReplaySubject<{}[]> = new ReplaySubject(1);
  public filterTheme: number;
  public filteredTeachers: {}[] = [];
  public chosenTeachers: {}[] = [];
  public faEdit = faEdit;
  public faClipboardList = faClipboardList;
  public faTrashAlt = faTrashAlt;
  public faSave = faSave;
  public faPlusCircle = faPlusCircle;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private moduleService: ModuleService,
    private evaluationService: EvaluationService,
    private gradeService: GradeService,
    private modalService: BsModalService,
    private themeService: ThemesServiceService,
    private accountService: AccountService,
    private router: Router,
    private academyService: AcademyService
  ) {
    this.route.params.subscribe(
      params => {
        this.academyId = Number(params.academyId);
        this.moduleService.getbyId(Number(params.moduleId)).subscribe(
          (module: Module) => {
            this.module = module;
            if (this.module.evaluationSubjects === null) {
              this.module.evaluationSubjects = '';
            }
            this.module$.next(this.module);
            this.getEvaluationsByModuleId();
            this.module.teacherIds.forEach(teacherId => this.getUserAccountById(teacherId, 'teacher'));
            this.getStudentsByAcademy();
            this.getTableHeaders();
            this.checkIfSuperUser();
          }
        );
      });
  }

  ngOnInit() {
  }

  public toggleUpdateModule() {
    this.getAllThemes();
    this.inUpdate = true;
    this.getModuleThemes();
    this.getAllTeachers();
  }

  public createStudentEvaluations(accountId: number) {
    this.evaluationSubjectArray = this.module.evaluationSubjects.split(', ');
    this.evaluationSubjectArray.pop();
    const evaluationToCreate = new Evaluation();
    evaluationToCreate.accountId = accountId;
    this.evaluationService.createEvaluation(evaluationToCreate).subscribe(
      (evaluationId: number) => {
        evaluationToCreate.id = evaluationId;
        this.module.evaluationIds.push(evaluationId);
        this.updateModule();
        this.evaluationSubjectArray.forEach(subject => {
          this.createGrade(subject, evaluationToCreate, this.evaluationSubjectArray.length);
        });
        this.evaluations.push(evaluationToCreate);
        this.evaluations$.next(this.evaluations);
        this.getTableRow(evaluationToCreate);
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

  public getStudentsByAcademy() {
    this.academyService.getbyId(this.academyId).subscribe(
      (academy: Academy) => academy.studentsIds.forEach(studentId => this.getUserAccountById(studentId, 'student'))
    );
  }

  public getEvaluationsByModuleId() {
    this.module.evaluationIds.forEach(id => {
      this.evaluationService.getbyId(id).subscribe(
        (evaluation: Evaluation) => {
          this.evaluations.push(evaluation);
          this.evaluations$.next(this.evaluations);
        }
      );
    });
  }

  public getTableHeaders() {
    if (this.module.evaluationSubjects !== '') {
      this.evaluationSubjectArray = this.module.evaluationSubjects.split(', ');
      this.evaluationSubjectArray.pop();
      this.tableHeaders = this.tableHeaders.concat(this.evaluationSubjectArray);
    }
    this.tableHeaders$.next(this.tableHeaders);
  }

  public getTableRow(evaluation: Evaluation) {
    const studentUserAccount = this.students[this.students.findIndex(student => student['account'].id === evaluation.accountId)];
    const row = { 'Evaluation': evaluation, 'Formando': studentUserAccount['user'].name, 'Comentário': evaluation.comment };
    evaluation.grades.forEach(grade => {
      row[grade.subject] = grade.mark;
    });
    this.tableRows.push(row);
    this.tableRows$.next(this.tableRows);
  }

  public createGrade(subject: string, evaluation: Evaluation, gradesNumber: number) {
    const grade = new Grade();
    grade.subject = subject;
    this.gradeService.createGrade(grade).subscribe(
      (id: number) => {
        grade.id = id;
        evaluation.grades.push(grade);
        if (evaluation.grades.length === gradesNumber) {
          this.evaluationService.updateEvaluation(evaluation).subscribe((res: any) => {
            console.log(evaluation);
          });
        }
      }
    );
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public addTheme() {
    this.themeService.create(this.newTheme).subscribe(
      (id: number) => {
        this.newTheme.id = id;
        this.allThemes.push(this.newTheme);
        this.allThemes$.next(this.allThemes);
        this.themeDropdownList.push({ 'id': id, 'name': this.newTheme.name });
        this.newTheme = new Theme();
        this.modalRef.hide();
      }
    );
  }

  public getUserAccountById(id: number, type: string) {
    this.accountService.getById(id).subscribe(
      (account: Account) => {
        this.userService.getUserById(account.userId).subscribe(
          (user: User) => {
            if (type === 'teacher') {
              if (!account.academyIds.includes(this.academyId)) {
                account.academyIds.push(this.academyId);
                this.accountService.update(account).subscribe();
              }
              this.teachers.push({ 'account': account, 'user': user });
              this.teachers$.next(this.teachers);
            } else if (type === 'student') {
              this.students.push({ 'account': account, 'user': user });
              this.students$.next(this.students);
              if (!this.evaluations.find(evaluation => evaluation.accountId === account.id)) {
                this.createStudentEvaluations(account.id);
              } else {
                this.getTableRow(this.evaluations.filter(evaluation => evaluation.accountId === account.id)[0]);
              }
            }
          }
        );
      }
    );
  }

  public showProfile(accountId: number) {
    this.router.navigate(['/academy-manager/profile/' + accountId]);
  }
  public updateModule() {
    this.updateTeachers();
    this.moduleService.updateModule(this.module).subscribe((res: any) => {
      this.module$.next(this.module);
      this.inUpdate = false;
    });
  }

  public updateTeachers() {
    this.chosenTeachers.forEach(teacher => {
      if (!this.module.teacherIds.includes(teacher['id'])) {
        const teacherAccount = this.allTeachers.filter(completeTeacher => completeTeacher['account'].id = teacher['id'])[0]['account'];
        teacherAccount.academyIds.push(this.academyId);
        this.accountService.update(teacherAccount).subscribe(
          (res: any) => {
            this.module.teacherIds.push(teacher['id']);
            this.getUserAccountById(teacher['id'], 'teacher');
          }
        );
      }
    });
  }

  public deleteModule() {
    this.moduleService.deleteModule(this.module.id).subscribe(
      (res: any) => {
        console.log(res);
        this.modalRef.hide();
        this.returnToAcademy();
      });
  }

  public returnToAcademy() {
    if (this.userService.isAdmin()) {
      this.router.navigate(['/academy-manager/academy/' + this.academyId]);
    } else if (this.userService.isSuperUser()) {
      this.router.navigate(['/academy-manager/academy-teacher/' + this.academyId]);
    }
  }

  public addEvaluationField() {
    if (this.evaluationField !== '' && !this.module.evaluationSubjects.includes(this.evaluationField)) {
      this.module.evaluationSubjects += this.evaluationField + ', ';
      this.tableHeaders.push(this.evaluationField);
      this.students.forEach(student => {
        const evaluationToEdit = this.evaluations[this.evaluations.findIndex(evaluation => evaluation.accountId === student['account'].id)];
        this.createGrade(this.evaluationField, evaluationToEdit, evaluationToEdit.grades.length + 1);
        const rowToEdit = this.tableRows[this.tableRows.findIndex(row => row['Formando'] === student['user'].name)];
        rowToEdit[this.evaluationField] = 0;
      });
      this.evaluationField = '';
      this.evaluationSubjectArray = this.module.evaluationSubjects.split(', ');
      this.evaluationSubjectArray.pop();
    }
  }

  public updateEvaluationSubjects() {
    this.updateModule();
    this.tableHeaders$.next(this.tableHeaders);
    this.modalRef.hide();
  }

  public openModalUpdateEvaluation(template: TemplateRef<any>, evaluationToUpdate: Evaluation, rowIndex: number) {
    this.index = rowIndex;
    this.evaluationToEdit = evaluationToUpdate;
    const studentUserAccount = this.students[this.students.findIndex(student => student['account'].id === evaluationToUpdate.accountId)];
    this.studentToEvaluate = studentUserAccount['user'].name;
    this.openModal(template);
  }

  public updateEvaluation() {
    this.evaluationService.updateEvaluation(this.evaluationToEdit).subscribe(
      (res: any) => {
        console.log(res);
        const row = {
          'Evaluation': this.evaluationToEdit, 'Formando': this.studentToEvaluate,
          'Comentário': this.evaluationToEdit.comment
        };
        this.evaluationToEdit.grades.forEach(grade => {
          row[grade.subject] = grade.mark;
        });
        this.tableRows[this.index] = row;
        this.tableRows$.next(this.tableRows);
        this.modalRef.hide();
      }
    );
  }

  public checkIfSuperUser() {
    if (this.userService.isSuperUser()) {
      this.isSuperUser = true;
    }
  }

  public getModuleThemes() {
    this.module.themes.forEach(theme => {
      this.moduleThemeDropdownList.push({ 'id': theme.id, 'text': theme.name });
    });
  }

  public getAllTeachers() {
    this.userService.getUsers('', '', 'SUPERUSER').subscribe(
      (teachers: User[]) => {
        if (teachers !== []) {
          this.allTeachers = [];
          teachers.forEach(teacher => {
            let include = false;
            this.accountService.getByUserId(teacher.id).subscribe(
              (teacherAccount: Account) => {
                teacherAccount.themes.forEach(teacherTheme => {
                  this.module.themes.forEach(moduleTheme => {
                    if (moduleTheme.id === teacherTheme.id) {
                      include = true;
                    }
                  });
                });
                if (include === true) {
                  this.allTeachers.push({ 'account': teacherAccount, 'name': teacher.name });
                  this.allTeachers$.next(this.allTeachers);
                  this.allTeachers.forEach(teacher => {
                    this.filteredTeachers.push({ 'id': teacher['account'].id, 'name': teacher['name'] });
                  });
                }
              }
            );
          });
        }
      }
    );
  }

  public filterTeachers() {
    this.filteredTeachers = [];
    let teachersByTheme: {}[];
    if (this.filterTheme !== null && this.filterTheme !== 0) {
      teachersByTheme = this.allTeachers.filter(teacher => teacher['account'].themes.find(theme => theme.id === this.filterTheme));
    } else {
      teachersByTheme = this.allTeachers;
    }
    teachersByTheme.forEach(teacher => {
      this.filteredTeachers.push({ 'id': teacher['account'].id, 'name': teacher['name'] });
    });
  }

  public deleteUnsavedSubjects(index: number, subject: string) {
    this.module.evaluationSubjects = this.module.evaluationSubjects.replace(subject + ', ', '');
    this.evaluationSubjectArray.splice(index, 1);
    this.tableHeaders.splice(index + 2, 1);
    this.evaluations.forEach(evaluation => {
      const gradeIndex = evaluation.grades.findIndex(grade => grade.subject === subject);
      const gradeToDelete = evaluation.grades.splice(gradeIndex, 1)[0];
      this.evaluationService.updateEvaluation(evaluation).subscribe(
        (resEval: any) => {
          this.gradeService.deleteGrade(gradeToDelete.id).subscribe(
            (resGrade: any) => {
              this.tableRows.splice(index + 2, 1);
            }
          );
        }
      );
    });
  }

  public deleteEvaluationSubject(index: number, subject: string) {
    this.deleteUnsavedSubjects(index, subject);
    this.moduleService.updateModule(this.module).subscribe(
      (res: any) => {
        this.module$.next(this.module);
      }
    );
  }

}
