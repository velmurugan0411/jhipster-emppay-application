import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISchedules, NewSchedules } from '../schedules.model';

export type PartialUpdateSchedules = Partial<ISchedules> & Pick<ISchedules, 'id'>;

type RestOf<T extends ISchedules | NewSchedules> = Omit<T, 'scheduleBeginDate' | 'scheduleEndDate'> & {
  scheduleBeginDate?: string | null;
  scheduleEndDate?: string | null;
};

export type RestSchedules = RestOf<ISchedules>;

export type NewRestSchedules = RestOf<NewSchedules>;

export type PartialUpdateRestSchedules = RestOf<PartialUpdateSchedules>;

export type EntityResponseType = HttpResponse<ISchedules>;
export type EntityArrayResponseType = HttpResponse<ISchedules[]>;

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/schedules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(schedules: NewSchedules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedules);
    return this.http
      .post<RestSchedules>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(schedules: ISchedules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedules);
    return this.http
      .put<RestSchedules>(`${this.resourceUrl}/${this.getSchedulesIdentifier(schedules)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(schedules: PartialUpdateSchedules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedules);
    return this.http
      .patch<RestSchedules>(`${this.resourceUrl}/${this.getSchedulesIdentifier(schedules)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSchedules>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSchedules[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSchedulesIdentifier(schedules: Pick<ISchedules, 'id'>): number {
    return schedules.id;
  }

  compareSchedules(o1: Pick<ISchedules, 'id'> | null, o2: Pick<ISchedules, 'id'> | null): boolean {
    return o1 && o2 ? this.getSchedulesIdentifier(o1) === this.getSchedulesIdentifier(o2) : o1 === o2;
  }

  addSchedulesToCollectionIfMissing<Type extends Pick<ISchedules, 'id'>>(
    schedulesCollection: Type[],
    ...schedulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const schedules: Type[] = schedulesToCheck.filter(isPresent);
    if (schedules.length > 0) {
      const schedulesCollectionIdentifiers = schedulesCollection.map(schedulesItem => this.getSchedulesIdentifier(schedulesItem)!);
      const schedulesToAdd = schedules.filter(schedulesItem => {
        const schedulesIdentifier = this.getSchedulesIdentifier(schedulesItem);
        if (schedulesCollectionIdentifiers.includes(schedulesIdentifier)) {
          return false;
        }
        schedulesCollectionIdentifiers.push(schedulesIdentifier);
        return true;
      });
      return [...schedulesToAdd, ...schedulesCollection];
    }
    return schedulesCollection;
  }

  protected convertDateFromClient<T extends ISchedules | NewSchedules | PartialUpdateSchedules>(schedules: T): RestOf<T> {
    return {
      ...schedules,
      scheduleBeginDate: schedules.scheduleBeginDate?.format(DATE_FORMAT) ?? null,
      scheduleEndDate: schedules.scheduleEndDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSchedules: RestSchedules): ISchedules {
    return {
      ...restSchedules,
      scheduleBeginDate: restSchedules.scheduleBeginDate ? dayjs(restSchedules.scheduleBeginDate) : undefined,
      scheduleEndDate: restSchedules.scheduleEndDate ? dayjs(restSchedules.scheduleEndDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSchedules>): HttpResponse<ISchedules> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSchedules[]>): HttpResponse<ISchedules[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
