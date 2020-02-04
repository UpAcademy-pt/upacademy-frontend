import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { DeclarationsService } from '../shared/services/declarations.service';
import { Account } from '../shared/models/account';
import { Declarations } from '../shared/models/declarations';
import { faArrowDown, faArrowUp, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-my-declarations',
  templateUrl: './my-declarations.component.html',
  styleUrls: ['./my-declarations.component.scss']
})
export class MyDeclarationsComponent implements OnInit {

  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  public currentAccount: Account;
  public currentAccount$: ReplaySubject<Account>;
  public declarations: Declarations[];
  public declarations$: ReplaySubject<Declarations[]> = new ReplaySubject(1);
  public tempDeclaration: Declarations;


  declarationsForm = new FormGroup({
    editabledec: new FormControl(),
    noteditabledec: new FormControl()
  });

  constructor(
    private accountApi: AccountService,
    private declarationsApi: DeclarationsService
  ) {
    this.currentAccount$ = this.accountApi.currentAccount$;
    this.currentAccount$.subscribe((account) => {
      this.currentAccount = account;
    });
    console.log(this.currentAccount);

    this.getDeclarations();
  }

  ngOnInit() {
  }

  getDeclarations() {
    this.declarationsApi.get(this.currentAccount.id).subscribe((declarations: any) => {
      this.declarations = declarations;
      this.declarations$.next(this.declarations); console.log(this.declarations);
    });
  }

  send(declaration: any) {
    var timeInMs = Date.now();

    var date = new Date(timeInMs);
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);


    this.tempDeclaration = declaration;
    this.tempDeclaration.fileUrlReturned = this.declarationsForm.get('editabledec').value;
    this.tempDeclaration.dateReceived = "" + year+"-"+month+"-"+day;
    this.declarationsApi.update(this.tempDeclaration).subscribe((res:any) => console.log(this.tempDeclaration));
  }
  
  // disableInputIfVerified(){
  //  if (this.declarations){
  // this.declarationsForm.controls['editable'].disable();}
  // }
}
