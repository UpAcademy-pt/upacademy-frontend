import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AcademyManagerRoutingModule } from './academy-manager-routing.module';
import { AcademyManagerComponent } from './academy-manager.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminAcademiesComponent } from './admin-academies/admin-academies.component';
import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { AdminTeachersComponent } from './admin-teachers/admin-teachers.component';
import { MyAcademiesComponent } from './my-academies/my-academies.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SharedModule } from './shared/shared.module';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapMultiselectDropdownModule } from 'ngx-bootstrap-multiselect-dropdown';
import { MyDeclarationsComponent } from './my-declarations/my-declarations.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AcademyViewComponent } from './academy-view/academy-view.component';
import { TeacherAcademyComponent } from './teacher-academy/teacher-academy.component';
import { ModulesComponent } from './modules/modules.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SuperuserClassromComponent } from './superuser-classrom/superuser-classrom.component';
import { TeacherAcademiesComponent } from './teacher-academies/teacher-academies.component';


@NgModule({
  declarations: [AcademyManagerComponent, SidebarComponent, AdminSidebarComponent, AdminAcademiesComponent, AdminStudentsComponent,
    AdminTeachersComponent, MyAcademiesComponent, MyProfileComponent, AccountProfileComponent, MyDeclarationsComponent,
    SuperuserClassromComponent, AcademyViewComponent, TeacherAcademyComponent, ModulesComponent,TeacherAcademiesComponent],
  imports: [
    CommonModule,
    AcademyManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgxBootstrapMultiselectDropdownModule,
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    ]
})
export class AcademyManagerModule { }
