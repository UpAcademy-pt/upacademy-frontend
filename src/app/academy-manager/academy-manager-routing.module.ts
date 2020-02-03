import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcademyManagerComponent } from './academy-manager.component';
import { AdminAcademiesComponent } from './admin-academies/admin-academies.component';
import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { AdminTeachersComponent } from './admin-teachers/admin-teachers.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { MyAcademiesComponent } from './my-academies/my-academies.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { MyDeclarationsComponent } from './my-declarations/my-declarations.component';
import { AcademyViewComponent } from './academy-view/academy-view.component';
import { TeacherAcademyComponent } from './teacher-academy/teacher-academy.component';
import { ModulesComponent } from './modules/modules.component';
import { SuperuserClassromComponent } from './superuser-classrom/superuser-classrom.component';
import { TeacherAcademiesComponent } from './teacher-academies/teacher-academies.component';


const routes: Routes = [
  {
    path: '',
    component: AcademyManagerComponent,
    children: [
      {
        path: 'admin-academies',
        component: AdminAcademiesComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'admin-students',
        component: AdminStudentsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'admin-teachers',
        component: AdminTeachersComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'my-academies',
        component: MyAcademiesComponent
      },
      {
        path: 'my-profile',
        component: MyProfileComponent
      },
      {
        path: 'profile/:accountId',
        component: AccountProfileComponent
      },
      {
        path: 'academy/:academyId',
        component: AcademyViewComponent
      },
      {
        path: 'my-declarations',
        component: MyDeclarationsComponent
      },
      {
        path: 'academy-classroom/:academyId',
        component: SuperuserClassromComponent
      },
      {
        path: 'academy/:academyId/module/:moduleId',
        component: ModulesComponent
      },
      {
        path: 'academy-teacher/:academyId',
        component: TeacherAcademyComponent
      },
      {
        path: 'teacher-academies',
        component: TeacherAcademiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademyManagerRoutingModule { }
