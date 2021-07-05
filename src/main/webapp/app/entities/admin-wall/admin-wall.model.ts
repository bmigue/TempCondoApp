import * as dayjs from 'dayjs';
import { IComment } from 'app/entities/comment/comment.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IAdminWall {
  id?: number;
  iDAdminWall?: number;
  postDate?: dayjs.Dayjs | null;
  post?: string | null;
  iDAdminWallComments?: IComment[] | null;
  userProfile?: IUserProfile | null;
}

export class AdminWall implements IAdminWall {
  constructor(
    public id?: number,
    public iDAdminWall?: number,
    public postDate?: dayjs.Dayjs | null,
    public post?: string | null,
    public iDAdminWallComments?: IComment[] | null,
    public userProfile?: IUserProfile | null
  ) {}
}

export function getAdminWallIdentifier(adminWall: IAdminWall): number | undefined {
  return adminWall.id;
}
