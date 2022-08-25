import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISchedules, NewSchedules } from '../schedules.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISchedules for edit and NewSchedulesFormGroupInput for create.
 */
type SchedulesFormGroupInput = ISchedules | PartialWithRequiredKeyOf<NewSchedules>;

type SchedulesFormDefaults = Pick<NewSchedules, 'id'>;

type SchedulesFormGroupContent = {
  id: FormControl<ISchedules['id'] | NewSchedules['id']>;
  scheduleId: FormControl<ISchedules['scheduleId']>;
  scheduleName: FormControl<ISchedules['scheduleName']>;
  scheduleBeginDate: FormControl<ISchedules['scheduleBeginDate']>;
  scheduleEndDate: FormControl<ISchedules['scheduleEndDate']>;
};

export type SchedulesFormGroup = FormGroup<SchedulesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SchedulesFormService {
  createSchedulesFormGroup(schedules: SchedulesFormGroupInput = { id: null }): SchedulesFormGroup {
    const schedulesRawValue = {
      ...this.getFormDefaults(),
      ...schedules,
    };
    return new FormGroup<SchedulesFormGroupContent>({
      id: new FormControl(
        { value: schedulesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      scheduleId: new FormControl(schedulesRawValue.scheduleId),
      scheduleName: new FormControl(schedulesRawValue.scheduleName),
      scheduleBeginDate: new FormControl(schedulesRawValue.scheduleBeginDate),
      scheduleEndDate: new FormControl(schedulesRawValue.scheduleEndDate),
    });
  }

  getSchedules(form: SchedulesFormGroup): ISchedules | NewSchedules {
    return form.getRawValue() as ISchedules | NewSchedules;
  }

  resetForm(form: SchedulesFormGroup, schedules: SchedulesFormGroupInput): void {
    const schedulesRawValue = { ...this.getFormDefaults(), ...schedules };
    form.reset(
      {
        ...schedulesRawValue,
        id: { value: schedulesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SchedulesFormDefaults {
    return {
      id: null,
    };
  }
}
