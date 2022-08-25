import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CoursesFormService, CoursesFormGroup } from './courses-form.service';
import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';

@Component({
  selector: 'jhi-courses-update',
  templateUrl: './courses-update.component.html',
})
export class CoursesUpdateComponent implements OnInit {
  isSaving = false;
  courses: ICourses | null = null;

  editForm: CoursesFormGroup = this.coursesFormService.createCoursesFormGroup();

  constructor(
    protected coursesService: CoursesService,
    protected coursesFormService: CoursesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
      if (courses) {
        this.updateForm(courses);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courses = this.coursesFormService.getCourses(this.editForm);
    if (courses.id !== null) {
      this.subscribeToSaveResponse(this.coursesService.update(courses));
    } else {
      this.subscribeToSaveResponse(this.coursesService.create(courses));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourses>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(courses: ICourses): void {
    this.courses = courses;
    this.coursesFormService.resetForm(this.editForm, courses);
  }
}
