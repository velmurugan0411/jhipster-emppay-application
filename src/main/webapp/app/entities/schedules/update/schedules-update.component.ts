import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SchedulesFormService, SchedulesFormGroup } from './schedules-form.service';
import { ISchedules } from '../schedules.model';
import { SchedulesService } from '../service/schedules.service';

@Component({
  selector: 'jhi-schedules-update',
  templateUrl: './schedules-update.component.html',
})
export class SchedulesUpdateComponent implements OnInit {
  isSaving = false;
  schedules: ISchedules | null = null;

  editForm: SchedulesFormGroup = this.schedulesFormService.createSchedulesFormGroup();

  constructor(
    protected schedulesService: SchedulesService,
    protected schedulesFormService: SchedulesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedules }) => {
      this.schedules = schedules;
      if (schedules) {
        this.updateForm(schedules);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const schedules = this.schedulesFormService.getSchedules(this.editForm);
    if (schedules.id !== null) {
      this.subscribeToSaveResponse(this.schedulesService.update(schedules));
    } else {
      this.subscribeToSaveResponse(this.schedulesService.create(schedules));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchedules>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(schedules: ISchedules): void {
    this.schedules = schedules;
    this.schedulesFormService.resetForm(this.editForm, schedules);
  }
}
