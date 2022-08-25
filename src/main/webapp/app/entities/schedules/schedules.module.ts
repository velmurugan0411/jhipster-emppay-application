import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SchedulesComponent } from './list/schedules.component';
import { SchedulesDetailComponent } from './detail/schedules-detail.component';
import { SchedulesUpdateComponent } from './update/schedules-update.component';
import { SchedulesDeleteDialogComponent } from './delete/schedules-delete-dialog.component';
import { SchedulesRoutingModule } from './route/schedules-routing.module';

@NgModule({
  imports: [SharedModule, SchedulesRoutingModule],
  declarations: [SchedulesComponent, SchedulesDetailComponent, SchedulesUpdateComponent, SchedulesDeleteDialogComponent],
})
export class SchedulesModule {}
