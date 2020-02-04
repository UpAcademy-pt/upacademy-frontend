import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from '../core/models/user';
import { UserServiceService } from '../core/services/user-service/user-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  modalRef: BsModalRef;
  private user: User;
  private currentPassword: string;
  private newPassword1: string;
  private newPassword2: string;
  private showCurrentPassError: boolean = false;
  private showNewPassError: boolean = false;


  constructor(
    private userApi: UserServiceService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {
    this.user = this.userApi.getCurrentUser();
  }

  ngOnInit() {
  }

  public updateUser() {
    this.userApi.updateUser(this.user).subscribe(
      (msg: string) => {
        this.showToastSuccess("Dados atualizados com sucesso");
        console.log(msg);
      },(error: string) => {
        this.showToastErro("Falha na atualização dos dados");
        console.log(error);
      });
  }

  public updatePassword() {
    console.log("Updating Password:");
    if (this.newPassword1 === this.newPassword2) {
      this.userApi.updatePassword(this.currentPassword, this.newPassword2).subscribe(
        (msg: string) => {
          this.showCurrentPassError = false;
          this.showNewPassError = false;
          this.modalRef.hide();
          this.currentPassword = "";
          this.newPassword1 = "";
          this.newPassword2 = "";
          this.showToastSuccess("Password atualizada com sucesso");
          console.log(msg);
        },(error: string) => {
          this.showCurrentPassError = true;
          console.log(error);
        });
    } else {
      console.log("A password digitada no campo 3 é diferente da digitada no campo 2");
      this.showNewPassError = true;
    }
  }

  openModalUpdatePassword(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  showToastSuccess(msg: string) {
    this.toastr.success(msg, 'Sucesso', {timeOut: 3000});
  }

  showToastErro(msg: string) {
    this.toastr.warning(msg, 'Erro', {timeOut: 3000});
  }

}
