import * as dayjs from 'dayjs';
import { IAdminWall } from 'app/entities/admin-wall/admin-wall.model';
import { IGeneralForum } from 'app/entities/general-forum/general-forum.model';

export interface IComment {
  id?: number;
  iDComment?: number;
  postDate?: dayjs.Dayjs | null;
  comment?: string | null;
  adminWall?: IAdminWall | null;
  generalForum?: IGeneralForum | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public iDComment?: number,
    public postDate?: dayjs.Dayjs | null,
    public comment?: string | null,
    public adminWall?: IAdminWall | null,
    public generalForum?: IGeneralForum | null
  ) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
