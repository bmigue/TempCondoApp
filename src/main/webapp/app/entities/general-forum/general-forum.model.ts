import * as dayjs from 'dayjs';
import { IComment } from 'app/entities/comment/comment.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IGeneralForum {
  id?: number;
  iDGeneralForum?: number;
  postDate?: dayjs.Dayjs | null;
  post?: string | null;
  iDGeneralForumComments?: IComment[] | null;
  userProfile?: IUserProfile | null;
}

export class GeneralForum implements IGeneralForum {
  constructor(
    public id?: number,
    public iDGeneralForum?: number,
    public postDate?: dayjs.Dayjs | null,
    public post?: string | null,
    public iDGeneralForumComments?: IComment[] | null,
    public userProfile?: IUserProfile | null
  ) {}
}

export function getGeneralForumIdentifier(generalForum: IGeneralForum): number | undefined {
  return generalForum.id;
}
