import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { DeclarationsService } from '../shared/services/declarations.service';
import { Account } from '../shared/models/account';
import { Declarations } from '../shared/models/declarations';
import { faArrowDown, faArrowUp, faCheckCircle, faTimesCircle, faClock, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { stringify } from 'querystring';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

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
  public faClock = faClock;
  public faPlusCircle = faPlusCircle;

  public modalDeclaration: Declarations;
  public currentAccount: Account;
  public currentAccount$: ReplaySubject<Account>;
  public declarations: Declarations[];
  public declarations$: ReplaySubject<Declarations[]> = new ReplaySubject(1);
  public tempDeclaration: Declarations;
  private modalRef: BsModalRef;


  declarationsForm = new FormGroup({
    editabledec: new FormControl(),
    noteditabledec: new FormControl()
  });

  constructor(
    private accountApi: AccountService,
    private modalService: BsModalService,
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

  public openModal(template: TemplateRef<any>,declaration: Declarations) {
    this.modalDeclaration = declaration;
    this.modalRef = this.modalService.show(template);
  }
  
  // disableInputIfVerified(){
  //  if (this.declarations){
  // this.declarationsForm.controls['editable'].disable();}
  // }

   public addDeclaration() {
    //  this.modalDeclaration
  //   this.newDeclaration.accountIdSender = this.currentAccountId;
  //   this.newDeclaration.accountIdReceiver = this.account.id;
  //   this.newDeclaration.verified = false;
  //   this.newDeclaration.dateReceived = null;
     const dateReceived: Date = new Date();
     const month = dateReceived.getMonth() + 1;
     const day = dateReceived.getDate();
     if (month < 10 && day < 10) {
       this.modalDeclaration.dateReceived = dateReceived.getFullYear() + '-0' + month + '-0' + dateReceived.getDate();
     } else if (month < 10) {
       this.modalDeclaration.dateReceived = dateReceived.getFullYear() + '-0' + (dateReceived.getMonth() + 1) + '-' + dateReceived.getDate();
     } else if (day < 10) {
       this.modalDeclaration.dateReceived = dateReceived.getFullYear() + '-' + (dateReceived.getMonth() + 1) + '-0' + dateReceived.getDate();
     } else {
       this.modalDeclaration.dateReceived = dateReceived.getFullYear() + '-' + (dateReceived.getMonth() + 1) + '-' + dateReceived.getDate();
     }
     this.declarationsApi.update(this.modalDeclaration).subscribe((res:any) => console.log(res));
  //   this.declarationsService.create(this.newDeclaration).subscribe(
  //     (id: number) => {
  //       this.newDeclaration.id = id;
  //       this.declarations.push(this.newDeclaration);
  //       console.log(this.newDeclaration);
        
  //       this.declarations$.next(this.declarations);
  //       this.modalRef.hide();
  //       this.newDeclaration = new Declarations();
  //     }
  //   );
   }

}
