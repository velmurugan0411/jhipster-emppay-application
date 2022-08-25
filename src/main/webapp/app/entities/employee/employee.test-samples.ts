import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 85985,
  email: 'Marlene_Hilpert67@gmail.com',
};

export const sampleWithFullData: IEmployee = {
  id: 56543,
  name: 'Administrator Rustic',
  email: 'Gus.Graham29@hotmail.com',
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
