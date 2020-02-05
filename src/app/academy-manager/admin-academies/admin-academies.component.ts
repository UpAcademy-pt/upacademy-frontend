import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Academy } from '../shared/models/academy';
import { AcademyService } from '../shared/services/academy.service';
import { BsModalService, BsModalRef, BsDropdownConfig } from 'ngx-bootstrap';
import { faEdit, faTrashAlt, faEye, faSort, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-academies',
  templateUrl: './admin-academies.component.html',
  styleUrls: ['./admin-academies.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AdminAcademiesComponent implements OnInit {

  currentDate = new Date();

  datesForm = new FormGroup({
    dateRange: new FormControl([
      new Date(),
      new Date(this.currentDate.setDate(this.currentDate.getDate() + 7))
    ])
  });

  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faEye = faEye;
  faSort = faSort;
  faLightbulb = faLightbulb;

  modalRef: BsModalRef;
  public academies: Academy[];
  public academies$: ReplaySubject<Academy[]> = new ReplaySubject(1);
  public edNameField: string;
  public dates: string;
  public datesArray: string[];
  public clientField: string;
  public modulesField: string[];
  public studentsField: string[];
  public warningField: string;
  public usefulInfoField: string;
  public academyTypeField: string;
  public academyToCreate: Academy = new Academy();
  public academyToUpdate: Academy = new Academy();
  public academyToDeleteRow: number;
  public showTable = false;
  private sortedByName = false;
  private filterSortedByName = false;
  private sortedByStatus = false;
  private filterSortedByStatus = false;
  private filteredAcademies: Academy[] = [];
  public nameFilter = '';
  public statusFilter = '';

  constructor(
    private router: Router,
    private academyService: AcademyService,
    private modalService: BsModalService
  ) {
    this.getAllAcademies();
  }

  ngOnInit() {
  }

  public getAllAcademies() {
    this.academyService.getAllAcademies()
      .subscribe((academies: Academy[]) => {
        this.academies = academies;
        this.academies$.next(this.academies);
        if (this.academies.length > 0) {
          this.showTable = true;
        }
      });
  }

  public createAcademy(dates: string) {
    this.getDates(dates, this.academyToCreate);
    this.academyToCreate.status = 'NOTACTIVE';
    this.academyService.createAcademy(this.academyToCreate).subscribe(
      (msg: string) => {
        this.getAllAcademies();
      }
    );
    console.log(this.academyToCreate);
    this.modalRef.hide();
    this.academyToCreate = new Academy();
  }

  public updateAcademy(dates: string) {
    this.getDates(dates, this.academyToUpdate);
    this.academyService.updateAcademy(this.academyToUpdate).subscribe(
      (msg: string) => {
        this.getAllAcademies();
        console.log(msg);
      }, (error: string) => {
        console.log(error);
      });
    console.log(this.academyToUpdate);
    this.modalRef.hide();
  }

  public deleteAcademy() {
    this.academyService.deleteAcademy(this.academies[this.academyToDeleteRow].id).subscribe(
      (msg: string) => {
        this.academies.splice(this.academyToDeleteRow, 1);
        if (this.academies.length <= 0) {
          this.showTable = false;
        }
      }, (error: string) => {
        console.log(error);
      });
    this.modalRef.hide();
  }

  openModalAddAcademy(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalUpdateAcademy(template: TemplateRef<any>, academyToUpdate: Academy) {
    this.academyToUpdate = academyToUpdate;
    this.modalRef = this.modalService.show(template);
  }

  openModalConfirmDeleteAcademy(template: TemplateRef<any>, rowIndex: number) {
    this.academyToDeleteRow = rowIndex;
    this.modalRef = this.modalService.show(template);
  }

  public getDates(dates: string, academy: Academy) {
    this.datesArray = dates.split(' - ');
    academy.startDate = this.datesArray[0];
    academy.endDate = this.datesArray[1];
  }

  public openAcademyById(id: number) {
    this.router.navigate(['academy-manager/academy/' + id]);
  }

  public sortTableByName() {
    if (this.nameFilter !== '') {
      if (this.filterSortedByName) {
        this.filteredAcademies.reverse();
      } else {
        this.filteredAcademies.sort((a, b) =>
          ((a.edName === b.edName) ? 0 : ((a.edName > b.edName) ? 1 : -1)));
        this.sortedByName = true;
        this.sortedByStatus = false;
        this.filterSortedByStatus = false;
      }
      this.academies$.next(this.filteredAcademies);
    } else {
      if (this.sortedByName) {
        this.academies.reverse();
      } else {
        this.academies.sort((a, b) =>
          ((a.edName === b.edName) ? 0 : ((a.edName > b.edName) ? 1 : -1)));
        this.sortedByName = true;
        this.sortedByStatus = false;
        this.filterSortedByStatus = false;
      }
      this.academies$.next(this.academies);
    }
  }

  public sortTableByStatus() {
    if (this.statusFilter !== '') {
      if (this.filterSortedByStatus) {
        this.filteredAcademies.reverse();
      } else {
        this.filteredAcademies.sort((a, b) =>
          ((a.status === b.status) ? 0 : ((a.status > b.status) ? 1 : -1)));
        this.sortedByStatus = true;
        this.sortedByName = false;
        this.filterSortedByName = false;
      }
      this.academies$.next(this.filteredAcademies);
    } else {
      if (this.sortedByStatus) {
        this.academies.reverse();
      } else {
        this.academies.sort((a, b) =>
          ((a.status === b.status) ? 0 : ((a.status > b.status) ? 1 : -1)));
        this.sortedByStatus = true;
        this.sortedByName = false;
        this.filterSortedByName = false;
      }
      this.academies$.next(this.academies);
    }
  }

  public filterTable() {
    if (this.nameFilter !== '') {
      this.filteredAcademies = this.academies.filter(
        academy => academy.edName.toLowerCase().includes(this.nameFilter.toLowerCase()));
      this.academies$.next(this.filteredAcademies);
    } else {
      this.academies$.next(this.academies);
    }
  }
}
