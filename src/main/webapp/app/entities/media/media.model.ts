export interface IMedia {
  id?: number;
  iDMedia?: number;
  url?: string | null;
}

export class Media implements IMedia {
  constructor(public id?: number, public iDMedia?: number, public url?: string | null) {}
}

export function getMediaIdentifier(media: IMedia): number | undefined {
  return media.id;
}
