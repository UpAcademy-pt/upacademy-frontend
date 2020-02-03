import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { AccountService } from '../shared/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { Account } from '../shared/models/account';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ReplaySubject } from 'rxjs';
import { MissedclassesService } from '../shared/services/missedclasses.service';
import { ThemesServiceService } from '../shared/services/themes-service.service';
import { Theme } from '../shared/models/theme';
import { Missed } from '../shared/models/missed';
import { AcademyService } from '../shared/services/academy.service';
import { Academy } from '../shared/models/academy';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss']
})
export class AccountProfileComponent implements OnInit {

  public account: Account;
  public account$: ReplaySubject<Account> = new ReplaySubject(1);
  private user: User;
  public user$: ReplaySubject<User> = new ReplaySubject(1);
  public inUpdate = false;
  private modalRef: BsModalRef;
  private misses: Missed[];
  public misses$: ReplaySubject<Missed[]> = new ReplaySubject(1);
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
  public newMissedClass = new Missed();
  private missedClassToUpdate = new Missed();
  private index: number;
  private accountAcademies: Academy[] = [];
  public accountAcademies$: ReplaySubject<Academy[]> = new ReplaySubject(1);


  constructor(
    private userService: UserServiceService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private missedClassService: MissedclassesService,
    private themeService: ThemesServiceService,
    private academyService: AcademyService
  ) {
    this.route.params.subscribe(
      params => {
        this.userService.getUserById(Number(params.userId)).subscribe(
          (user: User) => {
            this.user = user;
            this.user$.next(this.user);
          }
        );
        this.accountService.getByUserId(Number(params.userId)).subscribe(
          (account: Account) => {
            this.account = account;
            this.account$.next(this.account);
            if(this.account.academyIds != null){
              this.account.academyIds.forEach(academyId => this.getAcademy(academyId));
            }
            this.getMisses();
          }
        );
      }
    );
  }

  ngOnInit() {
  }

  public toggleUpdateAccount() {
    this.getAllThemes();
    this.inUpdate = true;
  }

  public updateAccount() {
    this.accountService.update(this.account).subscribe(
      (msg: string) => {
        this.inUpdate = false;
      }
    );
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public deleteAccount() {
    this.accountService.delete(this.account.id).subscribe(
      (res: any) => {
        console.log(res);
        this.modalRef.hide();
        this.returnToTable();
      });
  }

  public returnToTable() {
    if (this.user.role === 'USER') {
      this.router.navigate(['/academy-manager/admin-students']);
    } else if (this.user.role === 'SUPERUSER') {
      this.router.navigate(['/academy-manager/admin-teachers']);
    }
  }

  public getAcademy(id: number) {
    this.academyService.getbyId(id).subscribe(
      (res: any) => {
        if (res !== null) {
          this.accountAcademies.push(res);
          this.accountAcademies$.next(this.accountAcademies);
        }
      }
    );
  }

  public getMisses() {
    this.missedClassService.get(this.account.id).subscribe(
      (res: any) => {
        this.misses = res;
        this.misses$.next(this.misses);
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

  public addTheme() {
    this.themeService.create(this.newTheme).subscribe(
      (res: any) => {
        console.log(res);
        this.modalRef.hide();
        this.getAllThemes();
      }
    );
  }

  public addMissedDay() {
    this.newMissedClass.accountId = this.account.id;
    this.missedClassService.create(this.newMissedClass).subscribe(
      (res: any) => {
        this.misses.push(this.newMissedClass);
        this.misses$.next(this.misses);
      }
    );
  }

  public changeJustified(id: number) {
    this.index = this.misses.findIndex(missed => missed.id = id);
    this.missedClassToUpdate = this.misses[this.index];
    this.missedClassToUpdate.justified = !this.missedClassToUpdate.justified;
    this.missedClassService.update(this.missedClassToUpdate).subscribe(
      (res: any) => {
        this.misses[this.index] = this.missedClassToUpdate;
        this.misses$.next(this.misses);
      }
    )
  }



}
