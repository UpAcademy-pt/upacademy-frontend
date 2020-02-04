import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { Academy } from '../shared/models/academy';
import { Module } from '../shared/models/module';

import { ActivatedRoute } from '@angular/router';
import { AcademyService } from '../shared/services/academy.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-teacher-academy',
  templateUrl: './teacher-academy.component.html',
  styleUrls: ['./teacher-academy.component.scss']
})
export class TeacherAcademyComponent implements OnInit {

  private academy: Academy;
  private module: Module;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  private module$: ReplaySubject<Module> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private academyService: AcademyService,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe(
      params => {
        this.academyService.getbyId(Number(params.academyId)).subscribe(
          (academy: Academy) => {
            this.academy = academy;
            this.academy$.next(this.academy);
          }
        ); });
  }

  ngOnInit() {
  }
  //GONÇALO
  public refreshWarningAndInfo() {
    this.academyService.updateAcademy(this.academy).subscribe(
      (res: any) => {
        this.showToastSuccess("Aviso atualizado com sucesso");
        console.log(res);
      }, (error: string) => {
        this.showToastErro("Falha na atualização do aviso");
        console.log(error);
      }
    );
  }

  showToastSuccess(msg: string) {
    this.toastr.success(msg, 'Sucesso', {timeOut: 3000});
  }

  showToastErro(msg: string) {
    this.toastr.warning(msg, 'Erro', {timeOut: 3000});
  }

  public openModuleById(id: number) {
    this.router.navigate(['academy-manager/academy/' + academy.id + 'module' + module.id]);
  }
    // ver se o url precisa de meter 2 Ids no url
}
academy/:academyId/module/:moduleId