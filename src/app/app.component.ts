import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserServiceService } from './core/services/user-service/user-service.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { User } from './core/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
public currentUser$: ReplaySubject<User> = new ReplaySubject(1);
public show: boolean = false;
public subscriptionUser: Subscription;

constructor(
    private userApi: UserServiceService
    ){
      this.currentUser$ = this.userApi.currentUser$;
      this.subscriptionUser = this.currentUser$.subscribe(s => {
        if(s && s.id) {
          this.show = true
        }else{
          this.show = false;
        }
      });
    }

    ngOnInit() {}

    ngOnDestroy() {
      this.subscriptionUser.unsubscribe();
    }

  title = 'GroupAngularProject';

}
