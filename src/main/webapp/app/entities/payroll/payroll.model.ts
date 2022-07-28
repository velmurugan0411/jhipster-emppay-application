export interface IPayroll {
  id?: number;
  name?: string | null;
  paymonth?: number | null;
  amount?: number | null;
  notes?: string | null;
}

export class Payroll implements IPayroll {
  constructor(
    public id?: number,
    public name?: string | null,
    public paymonth?: number | null,
    public amount?: number | null,
    public notes?: string | null
  ) {}
}

export function getPayrollIdentifier(payroll: IPayroll): number | undefined {
  return payroll.id;
}
