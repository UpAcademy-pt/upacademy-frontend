import { Component, OnInit, Renderer2, ViewChild, ElementRef, Renderer, TemplateRef } from '@angular/core';
import { Posbyaccount } from '../shared/models/posbyaccount';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { HttpClient } from '@angular/common/http';
import { Account } from '../shared/models/account';
import { AcademyService } from '../shared/services/academy.service';
import { Academy } from '../shared/models/academy';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { User } from 'src/app/core/models/user';
import { MissedclassesService } from '../shared/services/missedclasses.service';
import { Missed } from '../shared/models/missed';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { faEye, faUserTimes, faUserCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-superuser-classrom',
  templateUrl: './superuser-classrom.component.html',
  styleUrls: ['./superuser-classrom.component.scss']
})
export class SuperuserClassromComponent implements OnInit {
  
  faEye = faEye;
  faUserTimes = faUserTimes;
  faUserCheck = faUserCheck;
  // private academy: Academy;
  // public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  public view = false;
  public tempMissed: Missed[] = [];
  private modalRef: BsModalRef;
 
  public modalAccount: Account;
  public modalUser: User;

  public tempAccount: Account;
  public tempAccount$: ReplaySubject<Account> = new ReplaySubject(1);

  private academyAccounts: Account[];
  // public academyAccounts$: ReplaySubject<Account[]> = new ReplaySubject(1);

  private academyAccountIds: any[];
  // public academyAccounts$: ReplaySubject<any[]> = new ReplaySubject(1);

  public numRows: number;
  public numCol: number;
  private index = 0;

  public arrayPositions: any[] = [];

  public arrayPositions$: ReplaySubject<any[]> = new ReplaySubject(1);

  public arrayPositionsRemoved: any[] = [];

  public missedClassArray: Missed[] = [];
  public missedClassArray$: ReplaySubject<Missed[]> = new ReplaySubject(1);

  //  public cleanArrayPos  = {'pos': '','account': {id: 0},'user': {id: 0}};
  // public tempPosAcc2 = new Posbyaccount();

  constructor(
    private accountApi: AccountService,
    private academyApi: AcademyService,
    private userApi: UserServiceService,
    private missedApi: MissedclassesService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private http: HttpClient) {
    this.route.params.subscribe(
      params => {
        this.academyApi.getbyId(Number(params.academyId)).subscribe(
          (res: Academy) => {
            this.academyAccountIds = res.studentsIds;
            this.academyAccountIds.forEach(student => this.getStudentAccounts(student));
          }
        );
      });
    this.getTodayMisses();
    // console.log(this.cleanArrayPos);

    // this.getAllStudents();
    // this.getUserAccount();
    // console.log(this.arrayPositions);
    // this.arrayPositions.map(pos => {
    //   pos.url = this.getUserUrl();
    //   pos.name = this.getUserName();
    // });
    // this.arrayPositions$.next(this.arrayPositions)
    // console.log(this.tempAccount);

  }

  ngOnInit() {
  }

  // public getAllStudents() {
  //   this.academyApi.getbyId(1).subscribe(
  //     (res: Academy) => {
  //       this.academyAccountIds = res.studentsIds;
  //       this.academyAccountIds.forEach(student => this.getStudentAccounts(student));
  //     }
  //   );
  // }
  public getStudentAccounts(id: number) {
    this.accountApi.getById(id).subscribe(
      (res: Account) => {
        this.getUser(res);
      })
  }

  public getUser(account: Account) {
    this.userApi.getUserById(account.userId).subscribe((res: User) => {
      this.arrayPositions.push({ 'pos': this.index, 'account': account, 'user': res });
      this.arrayPositions$.next(this.arrayPositions);
      this.index++;
      // console.log(this.arrayPositions);
    });
  }

  // public cleanElement(pos: Posbyaccount) {
  //   let tempPosAcc2 = new Posbyaccount();
  //   tempPosAcc2.pos = pos.pos;
  //   tempPosAcc2.account = new Account();
  //   tempPosAcc2.user = new User();
  //   tempPosAcc2.account.photoLink = 'https://simpleicon.com/wp-content/uploads/plus.png';
  //   tempPosAcc2.user.name = 'VAZIO';
  //   let index = this.arrayPositions.findIndex(x => x.pos === pos.pos);
  //   this.arrayPositions[index] = tempPosAcc2;
  //   // pos.pos = '';
  //   this.arrayPositionsRemoved.push(pos);
  // }

  // public addNewElement() {

  // }

  public addMissed(id: number) {
    let timeInMs = Date.now();
    let date = new Date(timeInMs);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    let missedClass = new Missed;
    missedClass.date = timeInMs;
    missedClass.accountId = id;
    missedClass.justified = false;
    missedClass.verifyDaily = "" + year + month + day;

    this.missedApi.create(missedClass).subscribe(
      (res: any) => console.log(res))

    this.missedClassArray.push(missedClass);
  }

  public getTodayMisses() {
    let timeInMs = Date.now();
    let date = new Date(timeInMs);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    this.missedApi.getByDate("" + year + month + day).subscribe(
      (res: any) => {
        res.forEach(num => this.missedClassArray.push(num));
        this.missedClassArray$.next(this.missedClassArray);
        // console.log(this.missedClassArray);
      })
  }

  public removeMissed(id: number) {

    this.tempMissed = [];
    let timeInMs = Date.now();
    let date = new Date(timeInMs);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    let missID: number;

    this.missedApi.get(id).subscribe((res: any) => {
      res.forEach(el => this.tempMissed.push(el));
      for (let i = 0; i < this.tempMissed.length; i++) {
        if (this.tempMissed[i].verifyDaily == "" + year + month + day) {
          missID = this.tempMissed[i].id;
          this.missedApi.delete(missID).subscribe((res: any) => {
            let index = this.missedClassArray.findIndex(x => x.id == id);
            this.missedClassArray.splice(index, 1);
            this.missedClassArray$.next(this.missedClassArray);
          });
        }
      }
      // console.log(this.tempMissed);
    })
    // for (let i = 0; i < this.tempMissed.length; i++) {
    //   if (this.tempMissed[i].verifyDaily == "" + year + month + day) {
    //     missID = this.tempMissed[i].id;
    //     this.missedApi.delete(missID).subscribe((res: any) => {
    //       let index = this.missedClassArray.findIndex(x => x.id == id);
    //       this.missedClassArray.splice(index, 1);
    //       // this.missedClassArray$.next(this.missedClassArray);
    //     });
    //   }
    // }
  }

  public chekedIfMissed(id: number) {
    for (let i = 0; i < this.missedClassArray.length; i++) {
      if (this.missedClassArray[i].accountId == id) {
        return true;
      }
    }
    return false;
  }

  // public changeView() {
  //   if (this.view) {
  //     this.view = false;
  //   }
  //   else {
  //     this.view = true;
  //   }
  // }

  public showProfileModal(template: TemplateRef<any>,account: Account,user: User) {
    this.modalUser = user;
    this.modalAccount = account;
    this.modalRef = this.modalService.show(template);
  }
}

