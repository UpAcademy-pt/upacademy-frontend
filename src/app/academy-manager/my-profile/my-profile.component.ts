import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/core/services/user-service/user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { AccountService } from '../shared/services/account.service';
import {Account} from '../shared/models/account';
import { ReplaySubject } from 'rxjs';
import { Missed } from '../shared/models/missed';
import { MissedclassesService } from '../shared/services/missedclasses.service';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  public currentAccount: Account;
  public currentAccount$: ReplaySubject<Account>;

  public name: string;
  public email: string;
  public role: string;
  public misses: Missed[];
  public misses$: ReplaySubject<Missed[]> = new ReplaySubject(1);
  public faEdit = faEdit;
  public faSave = faSave;



  readonly URL ="http://localhost:8080/coreFinalProject/academy-manager/missed/account";
  

    profileForm  = new FormGroup({
    editable: new FormControl(),
    notEditable: new FormControl(),
    formAge: new FormControl(),
    formAcademicB: new FormControl(),
    formAcademicD: new FormControl(),
    formNif: new FormControl(),
    formLinkedin: new FormControl(),
    formPhone: new FormControl()
  });

  constructor(
    private userApi: UserServiceService,
    private accountApi: AccountService,
    private missedClassApi: MissedclassesService,
    private http: HttpClient
  )
  {
    this.currentAccount$ = this.accountApi.currentAccount$;
    this.currentAccount$.subscribe((account) => {
      this.currentAccount = account;
      });
      // console.log(this.currentAccount);
      
    this.name = this.userApi.getCurrentName();
    this.email = this.userApi.getCurrentUser().email;
    this.role = this.userApi.getCurrentUser().role;
    this.profileForm.controls['notEditable'].disable();
    this.profileForm.controls['editable'].disable();
    this.profileForm.controls['formAge'].disable();
    this.profileForm.controls['formAcademicB'].disable();
    this.profileForm.controls['formAcademicD'].disable();
    this.profileForm.controls['formNif'].disable();
    this.profileForm.controls['formLinkedin'].disable();
    this.profileForm.controls['formPhone'].disable();
    this.getMisses();
    
   }

  ngOnInit() {
  }

  public MakeEdit(){
    this.profileForm.controls['editable'].enable();
   this.profileForm.controls['formAge'].enable();
    this.profileForm.controls['formAcademicB'].enable();
    this.profileForm.controls['formAcademicD'].enable();
    // this.profileForm.controls['formNif'].disable();
    this.profileForm.controls['formLinkedin'].enable();
    this.profileForm.controls['formPhone'].enable();
    this.toggleShowSaveBtn();

  }

  getMisses(){
    this.missedClassApi.get(this.currentAccount.id).subscribe((misses:any) => {this.misses = misses;
      this.misses$.next(this.misses) ; console.log(this.misses);});
  }


  save(){
    if(this.profileForm.get('formAge').value != null){
      this.currentAccount.age = this.profileForm.get('formAge').value;
    }
    if(this.profileForm.get('formAcademicB').value != null){
      this.currentAccount.academicBackground = this.profileForm.get('formAcademicB').value;
    }
    if(this.profileForm.get('formAcademicD').value != null){
      this.currentAccount.academicDegree = this.profileForm.get('formAcademicD').value;
    }
    if(this.profileForm.get('formNif').value != null){
      this.currentAccount.nif = this.profileForm.get('formNif').value;
    }
    if(this.profileForm.get('formLinkedin').value != null){
      this.currentAccount.linkedInAdress = this.profileForm.get('formLinkedin').value;
    }
    if(this.profileForm.get('formPhone').value != null){
      this.currentAccount.mobilePhone = this.profileForm.get('formPhone').value;
    }
    this.accountApi.update(this.currentAccount).subscribe((res:any) => console.log(this.currentAccount));

    this.toggleShowSaveBtn();
    this.profileForm.controls['editable'].disable();
    this.profileForm.controls['formAge'].disable();
    this.profileForm.controls['formAcademicB'].disable();
    this.profileForm.controls['formAcademicD'].disable();
    // this.profileForm.controls['formNif'].disable();
    this.profileForm.controls['formLinkedin'].disable();
    this.profileForm.controls['formPhone'].disable();
  }

isShown: boolean = false ; // hidden by default
toggleShowSaveBtn() {
this.isShown = ! this.isShown;
}



}

