import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SchedulesComponent } from '../list/schedules.component';
import { SchedulesDetailComponent } from '../detail/schedules-detail.component';
import { SchedulesUpdateComponent } from '../update/schedules-update.component';
import { SchedulesRoutingResolveService } from './schedules-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const schedulesRoute: Routes = [
  {
    path: '',
    component: SchedulesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SchedulesDetailComponent,
    resolve: {
      schedules: SchedulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SchedulesUpdateComponent,
    resolve: {
      schedules: SchedulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SchedulesUpdateComponent,
    resolve: {
      schedules: SchedulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(schedulesRoute)],
  exports: [RouterModule],
})
export class SchedulesRoutingModule {}
