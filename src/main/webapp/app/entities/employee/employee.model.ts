export interface IEmployee {
  id: number;
  name?: string | null;
  email?: string | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
