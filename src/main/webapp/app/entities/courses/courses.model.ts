export interface ICourses {
  id: number;
  courseId?: number | null;
  courseTitle?: string | null;
  courseDesc?: string | null;
}

export type NewCourses = Omit<ICourses, 'id'> & { id: null };
