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
  private evaluations$: ReplaySubject<Evaluation[]> = new ReplaySubject(1);

  public evaluationToCreate: Evaluation = new Evaluation();
  public grade: Grade = new Grade();
  public gradesArray: Grade[] = [];
  public gradesArray$: ReplaySubject<Grade[]> = new ReplaySubject(1);
  public showTable = false;

  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private moduleService: ModuleService,
    private evaluationService: EvaluationService,
    private gradeService: GradeService,
    private modalService: BsModalService
  ) {
    this.route.params.subscribe(
      params => {
        this.moduleService.getbyId(Number(params.moduleId)).subscribe(
          (module: Module) => {
            this.module = module;
            this.module$.next(this.module);
            this.getEvaluationsByModuleId(this.module.evaluationIds);
          }
        ); });
    this.getAllStudents();
    this.getAllGrades();
  }

  ngOnInit() {
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

  public getEvaluationsByModuleId(idArray: number[]) {
    idArray.forEach(id => {
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
      (id: string) => {
        //this.grade.id = id;
        this.gradesArray.push(this.grade);
        this.gradesArray$.next(this.gradesArray);
        console.log(this.gradesArray);
      }
    );
  }

  openModalAddEvaluation(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
