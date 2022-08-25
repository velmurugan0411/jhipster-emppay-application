import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISchedules } from '../schedules.model';
import { SchedulesService } from '../service/schedules.service';

@Injectable({ providedIn: 'root' })
export class SchedulesRoutingResolveService implements Resolve<ISchedules | null> {
  constructor(protected service: SchedulesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISchedules | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((schedules: HttpResponse<ISchedules>) => {
          if (schedules.body) {
            return of(schedules.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
