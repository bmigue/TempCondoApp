import * as dayjs from 'dayjs';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IPaymentLog {
  id?: number;
  iDPaymentLog?: number;
  dueDate?: dayjs.Dayjs | null;
  status?: string | null;
  userProfile?: IUserProfile | null;
}

export class PaymentLog implements IPaymentLog {
  constructor(
    public id?: number,
    public iDPaymentLog?: number,
    public dueDate?: dayjs.Dayjs | null,
    public status?: string | null,
    public userProfile?: IUserProfile | null
  ) {}
}

export function getPaymentLogIdentifier(paymentLog: IPaymentLog): number | undefined {
  return paymentLog.id;
}
