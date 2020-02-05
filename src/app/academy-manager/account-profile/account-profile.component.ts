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
import { faEdit, faTrashAlt, faSave, faMinusCircle, faPlusCircle,
  faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { DeclarationsService } from '../shared/services/declarations.service';
import { Declarations } from '../shared/models/declarations';

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
  public faEdit = faEdit;
  public faTrashAlt = faTrashAlt;
  public faSave = faSave;
  public faMinusCircle = faMinusCircle;
  public faPlusCircle = faPlusCircle;
  public missedDay: string;
  private declarations: Declarations[];
  public declarations$: ReplaySubject<Declarations[]> = new ReplaySubject(1);
  public newDeclaration: Declarations = new Declarations();
  private currentAccountId: number;
  public faCheckCircle = faCheckCircle;
  public faTimesCircle = faTimesCircle;
  public faClock = faClock;
  public faLinkedin = faLinkedin;


  constructor(
    private userService: UserServiceService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private missedClassService: MissedclassesService,
    private themeService: ThemesServiceService,
    private academyService: AcademyService,
    private declarationsService: DeclarationsService
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
            if (this.account.academyIds != null) {
              this.account.academyIds.forEach(academyId => this.getAcademy(academyId));
            }
            this.declarationsService.get(this.account.id).subscribe(
              (declarations: Declarations[]) => {
                this.declarations = declarations;
                this.declarations$.next(this.declarations);
              }
            );
            this.getMisses();
          }
        );
      }
    );
    this.accountService.currentAccount$.subscribe(
      (account: Account) => {
        this.currentAccountId = account.id;
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
      (id: number) => {
        console.log(id);
        this.modalRef.hide();
        this.getAllThemes();
      }
    );
  }

  public validateMissedDate() {
    let uniqueDate = true;
    this.misses.forEach(missed => {
      if (this.newMissedClass.date === missed.date) {
        uniqueDate = false;
      }
    });
    return uniqueDate;
  }

  public addMissedDay() {
    this.newMissedClass.date = new Date(this.missedDay).getTime();
    this.newMissedClass.accountId = this.account.id;
    this.newMissedClass.justified = false;
    if (this.validateMissedDate()) {
      this.missedClassService.create(this.newMissedClass).subscribe(
        (id: number) => {
          this.newMissedClass.id = id;
          this.misses.push(this.newMissedClass);
          console.log(this.misses[this.misses.length - 1]);
          this.misses$.next(this.misses);
          this.modalRef.hide();
          this.newMissedClass = new Missed();
          this.inUpdate = true;
        }
      );
    }
  }

  public changeJustified(id: number) {
    this.index = this.misses.findIndex(missed => missed.id = id);
    console.log(this.index);
    this.missedClassToUpdate = this.misses[this.index];
    console.log(this.missedClassToUpdate);
    this.missedClassToUpdate.justified = !this.missedClassToUpdate.justified;
    this.missedClassService.update(this.missedClassToUpdate).subscribe(
      (res: any) => {
        this.misses[this.index] = this.missedClassToUpdate;
        this.misses$.next(this.misses);
      }
    );
  }

  public deleteMissedClass(id: number) {
    this.missedClassService.delete(id).subscribe(
      (res: any) => {
        this.index = this.misses.findIndex(missed => missed.id = id);
        this.misses.splice(this.index, 1);
        this.misses$.next(this.misses);
      }
    );
  }

  public addDeclaration() {
    this.newDeclaration.accountIdSender = this.currentAccountId;
    this.newDeclaration.accountIdReceiver = this.account.id;
    this.newDeclaration.verified = false;
    const dateSent: Date = new Date();
    const month = dateSent.getMonth() + 1;
    const day = dateSent.getDate();
    if (month < 10 && day < 10) {
      this.newDeclaration.dateSent = dateSent.getFullYear() + '-0' + month + '-0' + dateSent.getDate();
    } else if (month < 10) {
      this.newDeclaration.dateSent = dateSent.getFullYear() + '-0' + (dateSent.getMonth() + 1) + '-' + dateSent.getDate();
    } else if (day < 10) {
      this.newDeclaration.dateSent = dateSent.getFullYear() + '-' + (dateSent.getMonth() + 1) + '-0' + dateSent.getDate();
    } else {
      this.newDeclaration.dateSent = dateSent.getFullYear() + '-' + (dateSent.getMonth() + 1) + '-' + dateSent.getDate();
    }
    this.declarationsService.create(this.newDeclaration).subscribe(
      (id: number) => {
        this.newDeclaration.id = id;
        this.declarations.push(this.newDeclaration);
        this.declarations$.next(this.declarations);
        this.modalRef.hide();
        this.newDeclaration = new Declarations();
      }
    );
  }

  public verifyDeclaration(declaration: Declarations, index: number) {
    declaration.verified = true;
    this.declarationsService.update(declaration).subscribe(
      (res: any) => {
        console.log(res);
        this.declarations[index] = declaration;
        this.declarations$.next(this.declarations);
      }
    );
  }

  public deleteDeclaration(id: number, index: number) {
    this.declarationsService.delete(id).subscribe(
      (res: any) => {
        this.declarations.splice(index, 1);
      }
    );
  }


}
