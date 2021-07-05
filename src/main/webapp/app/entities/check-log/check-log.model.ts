import * as dayjs from 'dayjs';
import { IGuest } from 'app/entities/guest/guest.model';

export interface ICheckLog {
  id?: number;
  iDCheckLog?: number;
  inDateTime?: dayjs.Dayjs | null;
  outDateTime?: dayjs.Dayjs | null;
  iDCheckLogGuests?: IGuest[] | null;
}

export class CheckLog implements ICheckLog {
  constructor(
    public id?: number,
    public iDCheckLog?: number,
    public inDateTime?: dayjs.Dayjs | null,
    public outDateTime?: dayjs.Dayjs | null,
    public iDCheckLogGuests?: IGuest[] | null
  ) {}
}

export function getCheckLogIdentifier(checkLog: ICheckLog): number | undefined {
  return checkLog.id;
}
