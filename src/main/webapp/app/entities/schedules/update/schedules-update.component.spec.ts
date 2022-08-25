import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SchedulesFormService } from './schedules-form.service';
import { SchedulesService } from '../service/schedules.service';
import { ISchedules } from '../schedules.model';

import { SchedulesUpdateComponent } from './schedules-update.component';

describe('Schedules Management Update Component', () => {
  let comp: SchedulesUpdateComponent;
  let fixture: ComponentFixture<SchedulesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let schedulesFormService: SchedulesFormService;
  let schedulesService: SchedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SchedulesUpdateComponent],
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
      .overrideTemplate(SchedulesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SchedulesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    schedulesFormService = TestBed.inject(SchedulesFormService);
    schedulesService = TestBed.inject(SchedulesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const schedules: ISchedules = { id: 456 };

      activatedRoute.data = of({ schedules });
      comp.ngOnInit();

      expect(comp.schedules).toEqual(schedules);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedules>>();
      const schedules = { id: 123 };
      jest.spyOn(schedulesFormService, 'getSchedules').mockReturnValue(schedules);
      jest.spyOn(schedulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedules }));
      saveSubject.complete();

      // THEN
      expect(schedulesFormService.getSchedules).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(schedulesService.update).toHaveBeenCalledWith(expect.objectContaining(schedules));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedules>>();
      const schedules = { id: 123 };
      jest.spyOn(schedulesFormService, 'getSchedules').mockReturnValue({ id: null });
      jest.spyOn(schedulesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedules: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedules }));
      saveSubject.complete();

      // THEN
      expect(schedulesFormService.getSchedules).toHaveBeenCalled();
      expect(schedulesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedules>>();
      const schedules = { id: 123 };
      jest.spyOn(schedulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(schedulesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
