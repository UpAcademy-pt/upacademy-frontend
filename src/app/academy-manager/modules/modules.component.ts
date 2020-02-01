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

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  private students$: ReplaySubject<User[]> = new ReplaySubject(1);
  private module: Module;
  private module$: ReplaySubject<Module> = new ReplaySubject(1);
  private evaluations: Evaluation[] = [];
  public evaluations$: ReplaySubject<Evaluation[]> = new ReplaySubject(1);
  private teachers: {}[] = [];
  public teachers$: ReplaySubject<{}[]> = new ReplaySubject(1);
  public evaluationToCreate: Evaluation = new Evaluation();
  public grade: Grade = new Grade();
  public gradesArray: Grade[] = [];
  public gradesArray$: ReplaySubject<Grade[]> = new ReplaySubject(1);
  public showTable = false;
  public inUpdate = false;
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
  private modalRef: BsModalRef;
  private academyId: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private moduleService: ModuleService,
    private evaluationService: EvaluationService,
    private gradeService: GradeService,
    private modalService: BsModalService,
    private themeService: ThemesServiceService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.route.params.subscribe(
      params => {
        this.academyId = Number(params.academyId);
        this.moduleService.getbyId(Number(params.moduleId)).subscribe(
          (module: Module) => {
            this.module = module;
            this.module$.next(this.module);
            this.getEvaluationsByModuleId();
            this.module.teacherIds.forEach(teacherId => this.getTeacherById(teacherId));
          }
        ); });
    /* this.getAllStudents();
    this.getAllGrades(); */
  }

  ngOnInit() {
  }

  public toggleUpdateModule() {
    this.getAllThemes();
    this.inUpdate = true;
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

  public getAllGrades() {
    this.gradeService.getAllGrades()
      .subscribe((grades: Grade[]) => {
        this.gradesArray = grades;
        this.gradesArray$.next(this.gradesArray);
        /* if (this.gradesArray.length > 0) {
          this.showTable = true;
        } */
      });
  }

  public getAllStudents() {
    this.userService.getUsers('', '', 'USER').subscribe(
      (res: any) => {
        this.students$.next(res);
        if (this.gradesArray.length > 0) {
          this.showTable = true;
        }
      }
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

  public createEvaluation() {
    this.evaluationToCreate.grades = this.gradesArray;
    this.evaluationService.createEvaluation(this.evaluationToCreate).subscribe(
      (msg: string) => {
       console.log(this.evaluationToCreate);
      }
    );
    this.modalRef.hide();
    this.evaluationToCreate = new Evaluation();
  }

  public createGrades() {
    this.gradeService.createGrade(this.grade).subscribe(
      (id: number) => {
        this.grade.id = id;
        this.gradesArray.push(this.grade);
        this.gradesArray$.next(this.gradesArray);
        console.log(this.gradesArray);
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public addTheme() {
    this.themeService.create(this.newTheme).subscribe(
      (id: number) => {
        this.newTheme.id = id;
        this.allThemes.push(this.newTheme);
        this.allThemes$.next(this.allThemes);
        this.themeDropdownList.push({ 'id': id, 'name': this.newTheme.name });
        this.modalRef.hide();
      }
    );
  }

  public getTeacherById(id: number) {
    this.accountService.getById(id).subscribe(
      (account: Account) => {
        this.userService.getUserById(account.userId).subscribe(
          (user: User) => {
            this.teachers.push({'account': account, 'user': user});
            this.teachers$.next(this.teachers);
          }
        );
      }
    );
  }

  public showProfile(accountId: number) {
    this.router.navigate(['/academy-manager/profile/' + accountId]);
  }

  public updateModule() {
    this.moduleService.updateModule(this.module).subscribe((res:any) => console.log(res));
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

}
