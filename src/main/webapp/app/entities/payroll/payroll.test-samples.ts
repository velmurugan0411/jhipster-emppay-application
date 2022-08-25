import { IPayroll, NewPayroll } from './payroll.model';

export const sampleWithRequiredData: IPayroll = {
  id: 38934,
};

export const sampleWithPartialData: IPayroll = {
  id: 67833,
  amount: 78242,
};

export const sampleWithFullData: IPayroll = {
  id: 81389,
  name: 'Money optimize',
  paymonth: 66049,
  amount: 11718,
};

export const sampleWithNewData: NewPayroll = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
