import { ICourses, NewCourses } from './courses.model';

export const sampleWithRequiredData: ICourses = {
  id: 22388,
};

export const sampleWithPartialData: ICourses = {
  id: 87613,
  courseId: 57199,
  courseTitle: 'Oro bus Chicken',
  courseDesc: 'Creative Re-contextualized Fresh',
};

export const sampleWithFullData: ICourses = {
  id: 17789,
  courseId: 97927,
  courseTitle: 'cross-platform Illinois Lock',
  courseDesc: 'Brand PCI',
};

export const sampleWithNewData: NewCourses = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
