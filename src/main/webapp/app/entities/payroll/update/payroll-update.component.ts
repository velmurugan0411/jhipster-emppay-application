import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PayrollFormService, PayrollFormGroup } from './payroll-form.service';
import { IPayroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';

@Component({
  selector: 'jhi-payroll-update',
  templateUrl: './payroll-update.component.html',
})
export class PayrollUpdateComponent implements OnInit {
  isSaving = false;
  payroll: IPayroll | null = null;

  editForm: PayrollFormGroup = this.payrollFormService.createPayrollFormGroup();

  constructor(
    protected payrollService: PayrollService,
    protected payrollFormService: PayrollFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payroll }) => {
      this.payroll = payroll;
      if (payroll) {
        this.updateForm(payroll);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payroll = this.payrollFormService.getPayroll(this.editForm);
    if (payroll.id !== null) {
      this.subscribeToSaveResponse(this.payrollService.update(payroll));
    } else {
      this.subscribeToSaveResponse(this.payrollService.create(payroll));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayroll>>): void {
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

  protected updateForm(payroll: IPayroll): void {
    this.payroll = payroll;
    this.payrollFormService.resetForm(this.editForm, payroll);
  }
}
