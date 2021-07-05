import { IUserInterface } from 'app/entities/user-interface/user-interface.model';
import { IPaymentLog } from 'app/entities/payment-log/payment-log.model';
import { IGuest } from 'app/entities/guest/guest.model';
import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ICondo } from 'app/entities/condo/condo.model';
import { IReservation } from 'app/entities/reservation/reservation.model';
import { IAdminWall } from 'app/entities/admin-wall/admin-wall.model';
import { IGeneralForum } from 'app/entities/general-forum/general-forum.model';

export interface IUserProfile {
  id?: number;
  iDUser?: number;
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  plateNumber?: string | null;
  status?: boolean | null;
  type?: string | null;
  idUserUserInterface?: IUserInterface | null;
  idUserPayments?: IPaymentLog[] | null;
  idUserGuests?: IGuest[] | null;
  idUserSchedules?: ISchedule[] | null;
  idUserCondos?: ICondo[] | null;
  idUserReservations?: IReservation[] | null;
  idUserAdminWalls?: IAdminWall[] | null;
  idUserGeneralForums?: IGeneralForum[] | null;
}

export class UserProfile implements IUserProfile {
  constructor(
    public id?: number,
    public iDUser?: number,
    public name?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public plateNumber?: string | null,
    public status?: boolean | null,
    public type?: string | null,
    public idUserUserInterface?: IUserInterface | null,
    public idUserPayments?: IPaymentLog[] | null,
    public idUserGuests?: IGuest[] | null,
    public idUserSchedules?: ISchedule[] | null,
    public idUserCondos?: ICondo[] | null,
    public idUserReservations?: IReservation[] | null,
    public idUserAdminWalls?: IAdminWall[] | null,
    public idUserGeneralForums?: IGeneralForum[] | null
  ) {
    this.status = this.status ?? false;
  }
}

export function getUserProfileIdentifier(userProfile: IUserProfile): number | undefined {
  return userProfile.id;
}
