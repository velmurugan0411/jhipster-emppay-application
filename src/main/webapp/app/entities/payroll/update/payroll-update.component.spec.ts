import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PayrollService } from '../service/payroll.service';
import { IPayroll, Payroll } from '../payroll.model';

import { PayrollUpdateComponent } from './payroll-update.component';

describe('Payroll Management Update Component', () => {
  let comp: PayrollUpdateComponent;
  let fixture: ComponentFixture<PayrollUpdateComponent>;
  let activatedRoute: ActivatedRoute;
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
    payrollService = TestBed.inject(PayrollService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const payroll: IPayroll = { id: 456 };

      activatedRoute.data = of({ payroll });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(payroll));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payroll>>();
      const payroll = { id: 123 };
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
      expect(comp.previousState).toHaveBeenCalled();
      expect(payrollService.update).toHaveBeenCalledWith(payroll);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payroll>>();
      const payroll = new Payroll();
      jest.spyOn(payrollService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payroll });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payroll }));
      saveSubject.complete();

      // THEN
      expect(payrollService.create).toHaveBeenCalledWith(payroll);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payroll>>();
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
      expect(payrollService.update).toHaveBeenCalledWith(payroll);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
