import { ICommonArea } from 'app/entities/common-area/common-area.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ICondo {
  id?: number;
  iDCondo?: number;
  nombre?: string | null;
  iDCondoCommonAreas?: ICommonArea[] | null;
  userProfile?: IUserProfile | null;
}

export class Condo implements ICondo {
  constructor(
    public id?: number,
    public iDCondo?: number,
    public nombre?: string | null,
    public iDCondoCommonAreas?: ICommonArea[] | null,
    public userProfile?: IUserProfile | null
  ) {}
}

export function getCondoIdentifier(condo: ICondo): number | undefined {
  return condo.id;
}
