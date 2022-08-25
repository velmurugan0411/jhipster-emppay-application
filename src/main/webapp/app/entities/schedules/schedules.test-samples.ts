import dayjs from 'dayjs/esm';

import { ISchedules, NewSchedules } from './schedules.model';

export const sampleWithRequiredData: ISchedules = {
  id: 11398,
};

export const sampleWithPartialData: ISchedules = {
  id: 50194,
  scheduleId: 77932,
  scheduleName: 'black',
  scheduleEndDate: dayjs('2022-08-24'),
};

export const sampleWithFullData: ISchedules = {
  id: 44434,
  scheduleId: 85793,
  scheduleName: 'Borders protocol',
  scheduleBeginDate: dayjs('2022-08-24'),
  scheduleEndDate: dayjs('2022-08-24'),
};

export const sampleWithNewData: NewSchedules = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
