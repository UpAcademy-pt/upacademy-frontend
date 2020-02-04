import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { Academy } from '../shared/models/academy';
import { Module } from '../shared/models/module';

import { ActivatedRoute } from '@angular/router';
import { AcademyService } from '../shared/services/academy.service';


@Component({
  selector: 'app-teacher-academy',
  templateUrl: './teacher-academy.component.html',
  styleUrls: ['./teacher-academy.component.scss']
})
export class TeacherAcademyComponent implements OnInit {

  private academy: Academy;
  private module: Module;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);

  constructor(
    private route: ActivatedRoute,
    private academyService: AcademyService
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

  public refreshWarningAndInfo() {
    this.academyService.updateAcademy(this.academy).subscribe(
      (res: any) => console.log(res)
    )
  }

}
