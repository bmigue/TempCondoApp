import * as dayjs from 'dayjs';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ISchedule {
  id?: number;
  iDSchedule?: number;
  inDateTime?: dayjs.Dayjs | null;
  outDateTime?: dayjs.Dayjs | null;
  userProfile?: IUserProfile | null;
}

export class Schedule implements ISchedule {
  constructor(
    public id?: number,
    public iDSchedule?: number,
    public inDateTime?: dayjs.Dayjs | null,
    public outDateTime?: dayjs.Dayjs | null,
    public userProfile?: IUserProfile | null
  ) {}
}

export function getScheduleIdentifier(schedule: ISchedule): number | undefined {
  return schedule.id;
}
