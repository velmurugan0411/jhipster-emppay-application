import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayroll, getPayrollIdentifier } from '../payroll.model';

export type EntityResponseType = HttpResponse<IPayroll>;
export type EntityArrayResponseType = HttpResponse<IPayroll[]>;

@Injectable({ providedIn: 'root' })
export class PayrollService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payrolls');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(payroll: IPayroll): Observable<EntityResponseType> {
    return this.http.post<IPayroll>(this.resourceUrl, payroll, { observe: 'response' });
  }

  update(payroll: IPayroll): Observable<EntityResponseType> {
    return this.http.put<IPayroll>(`${this.resourceUrl}/${getPayrollIdentifier(payroll) as number}`, payroll, { observe: 'response' });
  }

  partialUpdate(payroll: IPayroll): Observable<EntityResponseType> {
    return this.http.patch<IPayroll>(`${this.resourceUrl}/${getPayrollIdentifier(payroll) as number}`, payroll, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPayroll>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPayroll[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPayrollToCollectionIfMissing(payrollCollection: IPayroll[], ...payrollsToCheck: (IPayroll | null | undefined)[]): IPayroll[] {
    const payrolls: IPayroll[] = payrollsToCheck.filter(isPresent);
    if (payrolls.length > 0) {
      const payrollCollectionIdentifiers = payrollCollection.map(payrollItem => getPayrollIdentifier(payrollItem)!);
      const payrollsToAdd = payrolls.filter(payrollItem => {
        const payrollIdentifier = getPayrollIdentifier(payrollItem);
        if (payrollIdentifier == null || payrollCollectionIdentifiers.includes(payrollIdentifier)) {
          return false;
        }
        payrollCollectionIdentifiers.push(payrollIdentifier);
        return true;
      });
      return [...payrollsToAdd, ...payrollCollection];
    }
    return payrollCollection;
  }
}
