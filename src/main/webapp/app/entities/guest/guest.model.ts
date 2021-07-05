import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ICheckLog } from 'app/entities/check-log/check-log.model';

export interface IGuest {
  id?: number;
  iDGuest?: number;
  fullName?: string | null;
  plateNumber?: string | null;
  status?: string | null;
  userProfile?: IUserProfile | null;
  iDGuestCheckLogs?: ICheckLog[] | null;
}

export class Guest implements IGuest {
  constructor(
    public id?: number,
    public iDGuest?: number,
    public fullName?: string | null,
    public plateNumber?: string | null,
    public status?: string | null,
    public userProfile?: IUserProfile | null,
    public iDGuestCheckLogs?: ICheckLog[] | null
  ) {}
}

export function getGuestIdentifier(guest: IGuest): number | undefined {
  return guest.id;
}
