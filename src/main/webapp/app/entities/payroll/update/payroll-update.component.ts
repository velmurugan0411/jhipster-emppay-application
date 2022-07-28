import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPayroll, Payroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';

@Component({
  selector: 'jhi-payroll-update',
  templateUrl: './payroll-update.component.html',
})
export class PayrollUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    paymonth: [],
    amount: [],
    notes: [],
  });

  constructor(protected payrollService: PayrollService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payroll }) => {
      this.updateForm(payroll);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payroll = this.createFromForm();
    if (payroll.id !== undefined) {
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
    this.editForm.patchValue({
      id: payroll.id,
      name: payroll.name,
      paymonth: payroll.paymonth,
      amount: payroll.amount,
      notes: payroll.notes,
    });
  }

  protected createFromForm(): IPayroll {
    return {
      ...new Payroll(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      paymonth: this.editForm.get(['paymonth'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      notes: this.editForm.get(['notes'])!.value,
    };
  }
}
