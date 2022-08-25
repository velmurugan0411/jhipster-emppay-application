import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../schedules.test-samples';

import { SchedulesFormService } from './schedules-form.service';

describe('Schedules Form Service', () => {
  let service: SchedulesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulesFormService);
  });

  describe('Service methods', () => {
    describe('createSchedulesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSchedulesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            scheduleId: expect.any(Object),
            scheduleName: expect.any(Object),
            scheduleBeginDate: expect.any(Object),
            scheduleEndDate: expect.any(Object),
          })
        );
      });

      it('passing ISchedules should create a new form with FormGroup', () => {
        const formGroup = service.createSchedulesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            scheduleId: expect.any(Object),
            scheduleName: expect.any(Object),
            scheduleBeginDate: expect.any(Object),
            scheduleEndDate: expect.any(Object),
          })
        );
      });
    });

    describe('getSchedules', () => {
      it('should return NewSchedules for default Schedules initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSchedulesFormGroup(sampleWithNewData);

        const schedules = service.getSchedules(formGroup) as any;

        expect(schedules).toMatchObject(sampleWithNewData);
      });

      it('should return NewSchedules for empty Schedules initial value', () => {
        const formGroup = service.createSchedulesFormGroup();

        const schedules = service.getSchedules(formGroup) as any;

        expect(schedules).toMatchObject({});
      });

      it('should return ISchedules', () => {
        const formGroup = service.createSchedulesFormGroup(sampleWithRequiredData);

        const schedules = service.getSchedules(formGroup) as any;

        expect(schedules).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISchedules should not enable id FormControl', () => {
        const formGroup = service.createSchedulesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSchedules should disable id FormControl', () => {
        const formGroup = service.createSchedulesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
