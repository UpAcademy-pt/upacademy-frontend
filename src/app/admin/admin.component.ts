import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserServiceService } from '../core/services/user-service/user-service.service';
import { User } from '../core/models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AdminComponent implements OnInit {

  modalRef: BsModalRef;
  private nameField: string = "";
  private emailField: string = "";
  private roleField: string = "";
  private users: User[];
  private userToCreate: User = new User();
  private userToUpdate: User = new User();
  private rowUserToDelete: number;
  private headers = ["name", "email", "role"];
  private roles = [{ 'id': "USER", 'text': "User" }, { 'id': "SUPERUSER", 'text': "Super User" }, { 'id': "ADMIN", 'text': "Admin" }];
  private rolesWithAll = [{ 'id': "todos", 'text': "Todos" },{ 'id': "USER", 'text': "User" }, { 'id': "SUPERUSER", 'text': "Super User" }, { 'id': "ADMIN", 'text': "Admin" }];
  private showTable: boolean = false;
  private resetPasswordConfirm: boolean = true;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faUserPlus = faUserPlus;

  constructor(
    private userApi: UserServiceService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  getUsers() {
    this.userApi.getUsers(this.nameField, this.emailField, this.roleField).subscribe((users: User[]) => {
      this.users = users;
      if (this.users.length > 0) {
        this.showTable = true;
      }
      console.log(users);
    });
  }

  public createUser() {
    this.userApi.createUser(this.userToCreate).subscribe(
      (msg: string) => {
        this.showToastSuccess("Usuário adicionado com sucesso");
        this.getUsers();
        console.log(msg);
      }, (error: string) => {
        this.showToastErro("Falha ao adicionar Usuário");
        console.log(error);
      });
    this.modalRef.hide();
    this.userToCreate = new User();
  }

  public updateUser() {
    this.userApi.updateUser(this.userToUpdate).subscribe(
      (msg: string) => {
        this.showToastSuccess("Dados atualizados com sucesso");
        this.getUsers();
        console.log(msg);
      }, (error: string) => {
        this.showToastErro("Falha na atualização dos dados");
        console.log(error);
      });
    this.modalRef.hide();
    console.log(this.userToUpdate);
  }

  public deleteUser() {
    this.userApi.deleteUser(this.users[this.rowUserToDelete].id).subscribe(
      (msg: string) => {
        this.showToastSuccess("Usuário eliminado com sucesso");
        this.getUsers();
        console.log(msg);
        if (this.users.length <= 0) {
          this.showTable = false;
        }
      }, (error: string) => {
        this.showToastErro("Falha na eliminação do usuário");
        console.log(error);
      });
    this.modalRef.hide();
  }

  public resetPassword() {
    this.userApi.resetPassword(this.userToUpdate.id).subscribe(
      (msg: string) => {
        this.showToastSuccess("Password atualizado com sucesso");
        console.log(msg);
      }, (error: string) => {
        this.showToastErro("Falha na atualização da password");
        console.log(error);
      });
    this.modalRef.hide();
  }

  openModalAddUser(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalUpdateUser(template: TemplateRef<any>, rowIndex: number) {
    this.userToUpdate = { ...this.users[rowIndex] };
    this.modalRef = this.modalService.show(template);
  }

  openModalConfirmDeleteUser(template: TemplateRef<any>, rowIndex: number) {
    this.rowUserToDelete = rowIndex;
    this.modalRef = this.modalService.show(template);
  }

  showToastSuccess(msg: string) {
    this.toastr.success(msg, 'Sucesso', {timeOut: 3000});
  }

  showToastErro(msg: string) {
    this.toastr.warning(msg, 'Erro', {timeOut: 3000});
  }

}
