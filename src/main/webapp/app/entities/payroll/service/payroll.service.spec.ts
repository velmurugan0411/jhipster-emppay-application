import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPayroll, Payroll } from '../payroll.model';

import { PayrollService } from './payroll.service';

describe('Payroll Service', () => {
  let service: PayrollService;
  let httpMock: HttpTestingController;
  let elemDefault: IPayroll;
  let expectedResult: IPayroll | IPayroll[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PayrollService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      paymonth: 0,
      amount: 0,
      notes: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Payroll', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Payroll()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Payroll', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          paymonth: 1,
          amount: 1,
          notes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Payroll', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          notes: 'BBBBBB',
        },
        new Payroll()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Payroll', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          paymonth: 1,
          amount: 1,
          notes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Payroll', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPayrollToCollectionIfMissing', () => {
      it('should add a Payroll to an empty array', () => {
        const payroll: IPayroll = { id: 123 };
        expectedResult = service.addPayrollToCollectionIfMissing([], payroll);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payroll);
      });

      it('should not add a Payroll to an array that contains it', () => {
        const payroll: IPayroll = { id: 123 };
        const payrollCollection: IPayroll[] = [
          {
            ...payroll,
          },
          { id: 456 },
        ];
        expectedResult = service.addPayrollToCollectionIfMissing(payrollCollection, payroll);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Payroll to an array that doesn't contain it", () => {
        const payroll: IPayroll = { id: 123 };
        const payrollCollection: IPayroll[] = [{ id: 456 }];
        expectedResult = service.addPayrollToCollectionIfMissing(payrollCollection, payroll);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payroll);
      });

      it('should add only unique Payroll to an array', () => {
        const payrollArray: IPayroll[] = [{ id: 123 }, { id: 456 }, { id: 40840 }];
        const payrollCollection: IPayroll[] = [{ id: 123 }];
        expectedResult = service.addPayrollToCollectionIfMissing(payrollCollection, ...payrollArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const payroll: IPayroll = { id: 123 };
        const payroll2: IPayroll = { id: 456 };
        expectedResult = service.addPayrollToCollectionIfMissing([], payroll, payroll2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payroll);
        expect(expectedResult).toContain(payroll2);
      });

      it('should accept null and undefined values', () => {
        const payroll: IPayroll = { id: 123 };
        expectedResult = service.addPayrollToCollectionIfMissing([], null, payroll, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payroll);
      });

      it('should return initial array if no Payroll is added', () => {
        const payrollCollection: IPayroll[] = [{ id: 123 }];
        expectedResult = service.addPayrollToCollectionIfMissing(payrollCollection, undefined, null);
        expect(expectedResult).toEqual(payrollCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
