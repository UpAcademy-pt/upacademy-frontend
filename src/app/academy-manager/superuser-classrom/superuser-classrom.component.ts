import { Component, OnInit, Renderer2, ViewChild, ElementRef, Renderer } from '@angular/core';
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

@Component({
  selector: 'app-superuser-classrom',
  templateUrl: './superuser-classrom.component.html',
  styleUrls: ['./superuser-classrom.component.scss']
})
export class SuperuserClassromComponent implements OnInit {
  private academy: Academy;
  public academy$: ReplaySubject<Academy> = new ReplaySubject(1);
  public view = false;

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

   public missedClassArray: number[] = [];

  // public tempPosAcc = new Posbyaccount();
  // public tempPosAcc2 = new Posbyaccount();

  constructor(
    private accountApi: AccountService,
    private academyApi: AcademyService,
    private userApi: UserServiceService,
    private missedApi: MissedclassesService,
    private route: ActivatedRoute,
    private http: HttpClient) {
      this.route.params.subscribe(
        params => {
          this.academyApi.getbyId(Number(params.academyId)).subscribe(
            (res: Academy) => {
              this.academyAccountIds = res.studentsIds;
              this.academyAccountIds.forEach(student => this.getStudentAccounts(student));
            }
          ); });
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
public getStudentAccounts(id: number){
  this.accountApi.getById(id).subscribe(
    (res: Account) => {
      this.getUser(res);   
})}

public getUser(account: Account){
  this.userApi.getUserById(account.userId).subscribe((res: User) => { this.arrayPositions.push({'pos': this.index,'account': account,'user': res});
  this.arrayPositions$.next(this.arrayPositions);
  this.index++;
  console.log(this.arrayPositions);
  
});
}

  public cleanElement() {
  }

  public addMissed(id: number){
    var timeInMs = Date.now();
    var date = new Date(timeInMs);
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    let missedClass = new Missed;
    missedClass.data = "" + year+"-"+month+"-"+day;
    missedClass.accountId = id;
    missedClass.justified = false;

    this.missedApi.create(missedClass).subscribe(
      (res: any) =>  console.log(res))

    this.missedClassArray.push(id);
  }

  public removeMissed(id: number){

  }

  public chekedIfMissed(id: number){
    return this.missedClassArray.includes(id);
  }

  public changeView(){
    if (this.view){
      this.view = false;
    }
    else {
      this.view = true;
    }
  }
}

