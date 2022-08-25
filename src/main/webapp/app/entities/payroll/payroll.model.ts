export interface IPayroll {
  id: number;
  name?: string | null;
  paymonth?: number | null;
  amount?: number | null;
}

export type NewPayroll = Omit<IPayroll, 'id'> & { id: null };
