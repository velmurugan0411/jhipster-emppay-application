import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICourses, NewCourses } from '../courses.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourses for edit and NewCoursesFormGroupInput for create.
 */
type CoursesFormGroupInput = ICourses | PartialWithRequiredKeyOf<NewCourses>;

type CoursesFormDefaults = Pick<NewCourses, 'id'>;

type CoursesFormGroupContent = {
  id: FormControl<ICourses['id'] | NewCourses['id']>;
  courseId: FormControl<ICourses['courseId']>;
  courseTitle: FormControl<ICourses['courseTitle']>;
  courseDesc: FormControl<ICourses['courseDesc']>;
};

export type CoursesFormGroup = FormGroup<CoursesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CoursesFormService {
  createCoursesFormGroup(courses: CoursesFormGroupInput = { id: null }): CoursesFormGroup {
    const coursesRawValue = {
      ...this.getFormDefaults(),
      ...courses,
    };
    return new FormGroup<CoursesFormGroupContent>({
      id: new FormControl(
        { value: coursesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      courseId: new FormControl(coursesRawValue.courseId),
      courseTitle: new FormControl(coursesRawValue.courseTitle),
      courseDesc: new FormControl(coursesRawValue.courseDesc),
    });
  }

  getCourses(form: CoursesFormGroup): ICourses | NewCourses {
    return form.getRawValue() as ICourses | NewCourses;
  }

  resetForm(form: CoursesFormGroup, courses: CoursesFormGroupInput): void {
    const coursesRawValue = { ...this.getFormDefaults(), ...courses };
    form.reset(
      {
        ...coursesRawValue,
        id: { value: coursesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CoursesFormDefaults {
    return {
      id: null,
    };
  }
}
