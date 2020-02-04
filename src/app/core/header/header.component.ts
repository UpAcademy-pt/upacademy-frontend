import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service/user-service.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {

  public name: string;
  public showAdminTab: boolean = false;
  public isCollapsed = true;
  faUserAlt = faUserAlt;
  faSignOutAlt = faSignOutAlt;

  constructor(
    private userApi: UserServiceService,
    private router: Router
  ) {
    this.name = this.userApi.getCurrentName();
    if (this.userApi.isAdmin()) {
      this.showAdminTab = true;
    }
  }

  ngOnInit() {
  }

  private logout() {
    this.userApi.logout();
    this.router.navigate(['/login']);
  }

  public collapse() {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

}
