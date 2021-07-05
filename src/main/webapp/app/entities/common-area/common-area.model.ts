import { IMedia } from 'app/entities/media/media.model';
import { IReservation } from 'app/entities/reservation/reservation.model';
import { ICondo } from 'app/entities/condo/condo.model';

export interface ICommonArea {
  id?: number;
  iDCommonArea?: number;
  status?: string | null;
  name?: string | null;
  iDCommonAreaMedia?: IMedia | null;
  iDCommonAreaReservations?: IReservation[] | null;
  condo?: ICondo | null;
}

export class CommonArea implements ICommonArea {
  constructor(
    public id?: number,
    public iDCommonArea?: number,
    public status?: string | null,
    public name?: string | null,
    public iDCommonAreaMedia?: IMedia | null,
    public iDCommonAreaReservations?: IReservation[] | null,
    public condo?: ICondo | null
  ) {}
}

export function getCommonAreaIdentifier(commonArea: ICommonArea): number | undefined {
  return commonArea.id;
}
