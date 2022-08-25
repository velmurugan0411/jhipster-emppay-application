import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employee',
        data: { pageTitle: 'lmsApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'payroll',
        data: { pageTitle: 'lmsApp.payroll.home.title' },
        loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule),
      },
      {
        path: 'courses',
        data: { pageTitle: 'lmsApp.courses.home.title' },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'schedules',
        data: { pageTitle: 'lmsApp.schedules.home.title' },
        loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
