import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISchedules } from '../schedules.model';

@Component({
  selector: 'jhi-schedules-detail',
  templateUrl: './schedules-detail.component.html',
})
export class SchedulesDetailComponent implements OnInit {
  schedules: ISchedules | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedules }) => {
      this.schedules = schedules;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
