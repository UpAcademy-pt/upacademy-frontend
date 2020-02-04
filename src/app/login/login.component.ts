import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user';
import { UserServiceService } from '../core/services/user-service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User = new User();
  public showPasswordError: boolean = false;

  constructor(
    private userApi: UserServiceService,
    private router: Router
  ) { }
  
  public login() {
    this.userApi.authenticateUser(this.user).subscribe((result: any) => {
      console.log(result);
      this.userApi.setCurrentUser(result);
      this.router.navigate(['/'])
    }, (error) => {
      this.showPasswordError = true;
    });
  }

  ngOnInit() {
  }

}
