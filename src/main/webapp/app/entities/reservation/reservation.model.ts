import * as dayjs from 'dayjs';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ICommonArea } from 'app/entities/common-area/common-area.model';

export interface IReservation {
  id?: number;
  iDReservation?: number;
  resDateTime?: dayjs.Dayjs | null;
  status?: string | null;
  userProfile?: IUserProfile | null;
  commonArea?: ICommonArea | null;
}

export class Reservation implements IReservation {
  constructor(
    public id?: number,
    public iDReservation?: number,
    public resDateTime?: dayjs.Dayjs | null,
    public status?: string | null,
    public userProfile?: IUserProfile | null,
    public commonArea?: ICommonArea | null
  ) {}
}

export function getReservationIdentifier(reservation: IReservation): number | undefined {
  return reservation.id;
}
