import dayjs from 'dayjs/esm';

export interface ISchedules {
  id: number;
  scheduleId?: number | null;
  scheduleName?: string | null;
  scheduleBeginDate?: dayjs.Dayjs | null;
  scheduleEndDate?: dayjs.Dayjs | null;
}

export type NewSchedules = Omit<ISchedules, 'id'> & { id: null };
