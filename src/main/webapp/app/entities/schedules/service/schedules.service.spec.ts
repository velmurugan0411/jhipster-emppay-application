import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISchedules } from '../schedules.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../schedules.test-samples';

import { SchedulesService, RestSchedules } from './schedules.service';

const requireRestSample: RestSchedules = {
  ...sampleWithRequiredData,
  scheduleBeginDate: sampleWithRequiredData.scheduleBeginDate?.format(DATE_FORMAT),
  scheduleEndDate: sampleWithRequiredData.scheduleEndDate?.format(DATE_FORMAT),
};

describe('Schedules Service', () => {
  let service: SchedulesService;
  let httpMock: HttpTestingController;
  let expectedResult: ISchedules | ISchedules[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SchedulesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Schedules', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const schedules = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(schedules).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Schedules', () => {
      const schedules = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(schedules).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Schedules', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Schedules', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Schedules', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSchedulesToCollectionIfMissing', () => {
      it('should add a Schedules to an empty array', () => {
        const schedules: ISchedules = sampleWithRequiredData;
        expectedResult = service.addSchedulesToCollectionIfMissing([], schedules);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(schedules);
      });

      it('should not add a Schedules to an array that contains it', () => {
        const schedules: ISchedules = sampleWithRequiredData;
        const schedulesCollection: ISchedules[] = [
          {
            ...schedules,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSchedulesToCollectionIfMissing(schedulesCollection, schedules);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Schedules to an array that doesn't contain it", () => {
        const schedules: ISchedules = sampleWithRequiredData;
        const schedulesCollection: ISchedules[] = [sampleWithPartialData];
        expectedResult = service.addSchedulesToCollectionIfMissing(schedulesCollection, schedules);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(schedules);
      });

      it('should add only unique Schedules to an array', () => {
        const schedulesArray: ISchedules[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const schedulesCollection: ISchedules[] = [sampleWithRequiredData];
        expectedResult = service.addSchedulesToCollectionIfMissing(schedulesCollection, ...schedulesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const schedules: ISchedules = sampleWithRequiredData;
        const schedules2: ISchedules = sampleWithPartialData;
        expectedResult = service.addSchedulesToCollectionIfMissing([], schedules, schedules2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(schedules);
        expect(expectedResult).toContain(schedules2);
      });

      it('should accept null and undefined values', () => {
        const schedules: ISchedules = sampleWithRequiredData;
        expectedResult = service.addSchedulesToCollectionIfMissing([], null, schedules, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(schedules);
      });

      it('should return initial array if no Schedules is added', () => {
        const schedulesCollection: ISchedules[] = [sampleWithRequiredData];
        expectedResult = service.addSchedulesToCollectionIfMissing(schedulesCollection, undefined, null);
        expect(expectedResult).toEqual(schedulesCollection);
      });
    });

    describe('compareSchedules', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSchedules(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSchedules(entity1, entity2);
        const compareResult2 = service.compareSchedules(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSchedules(entity1, entity2);
        const compareResult2 = service.compareSchedules(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSchedules(entity1, entity2);
        const compareResult2 = service.compareSchedules(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
