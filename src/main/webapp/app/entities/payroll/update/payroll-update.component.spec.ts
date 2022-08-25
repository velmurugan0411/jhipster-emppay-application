import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PayrollFormService } from './payroll-form.service';
import { PayrollService } from '../service/payroll.service';
import { IPayroll } from '../payroll.model';

import { PayrollUpdateComponent } from './payroll-update.component';

describe('Payroll Management Update Component', () => {
  let comp: PayrollUpdateComponent;
  let fixture: ComponentFixture<PayrollUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let payrollFormService: PayrollFormService;
  let payrollService: PayrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PayrollUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PayrollUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayrollUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    payrollFormService = TestBed.inject(PayrollFormService);
    payrollService = TestBed.inject(PayrollService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const payroll: IPayroll = { id: 456 };

      activatedRoute.data = of({ payroll });
      comp.ngOnInit();

      expect(comp.payroll).toEqual(payroll);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayroll>>();
      const payroll = { id: 123 };
      jest.spyOn(payrollFormService, 'getPayroll').mockReturnValue(payroll);
      jest.spyOn(payrollService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payroll });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payroll }));
      saveSubject.complete();

      // THEN
      expect(payrollFormService.getPayroll).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(payrollService.update).toHaveBeenCalledWith(expect.objectContaining(payroll));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayroll>>();
      const payroll = { id: 123 };
      jest.spyOn(payrollFormService, 'getPayroll').mockReturnValue({ id: null });
      jest.spyOn(payrollService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payroll: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payroll }));
      saveSubject.complete();

      // THEN
      expect(payrollFormService.getPayroll).toHaveBeenCalled();
      expect(payrollService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayroll>>();
      const payroll = { id: 123 };
      jest.spyOn(payrollService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payroll });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(payrollService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
