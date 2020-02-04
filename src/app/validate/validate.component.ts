import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../core/services/user-service/user-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../core/models/user';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

  public id: number;
  public email: string;
  public oldPassword: string;
  public newPassword1: string;
  public newPassword2: string;
  public validUser: User= new User();
  private showCurrentPassError: boolean = false;
  private showNewPassError: boolean = false;


  constructor(
    private userApi: UserServiceService,
    private router: Router,
    private route :ActivatedRoute
  ) { 
    this.route.params.subscribe(
      params => {
        this.userApi.getUserById(Number(params.id)).subscribe(
          (user: User) => {
            if(user.validatedEmail != true ||user == null){
              this.router.navigate(['/not-found']);
            }else{
              this.validUser=user;
              console.log(this.validUser);
              
            };
          }
        )}
    )
  }
  
  ngOnInit() {
  }

  public validateUser(){
    if(this.validUser.email ==this.email){
      if(this.newPassword1 == this.newPassword2){
        this.validUser.password = this.oldPassword;
        this.userApi.validatePassword(this.validUser, this.newPassword1).subscribe(
          (msg: string) => {
            this.showCurrentPassError = false;
            this.oldPassword = "";
            this.newPassword1 = "";
            this.newPassword2 = "";
            console.log(msg);
          },(error: string) => {
            this.showCurrentPassError = true;
            console.log(error);
          });
      } else {
        console.log("A password digitada no campo 3 é diferente da digitada no campo 2");
        this.showNewPassError = true;
      }
  }}
}
