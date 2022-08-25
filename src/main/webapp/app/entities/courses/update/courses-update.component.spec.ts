import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CoursesFormService } from './courses-form.service';
import { CoursesService } from '../service/courses.service';
import { ICourses } from '../courses.model';

import { CoursesUpdateComponent } from './courses-update.component';

describe('Courses Management Update Component', () => {
  let comp: CoursesUpdateComponent;
  let fixture: ComponentFixture<CoursesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let coursesFormService: CoursesFormService;
  let coursesService: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CoursesUpdateComponent],
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
      .overrideTemplate(CoursesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoursesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    coursesFormService = TestBed.inject(CoursesFormService);
    coursesService = TestBed.inject(CoursesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const courses: ICourses = { id: 456 };

      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      expect(comp.courses).toEqual(courses);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesFormService, 'getCourses').mockReturnValue(courses);
      jest.spyOn(coursesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courses }));
      saveSubject.complete();

      // THEN
      expect(coursesFormService.getCourses).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(coursesService.update).toHaveBeenCalledWith(expect.objectContaining(courses));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesFormService, 'getCourses').mockReturnValue({ id: null });
      jest.spyOn(coursesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courses }));
      saveSubject.complete();

      // THEN
      expect(coursesFormService.getCourses).toHaveBeenCalled();
      expect(coursesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(coursesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
