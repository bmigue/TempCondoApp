import { IMedia } from 'app/entities/media/media.model';

export interface IProperty {
  id?: number;
  iDProperty?: number;
  type?: string | null;
  description?: string | null;
  hasHouseBuilt?: boolean | null;
  propertySize?: number | null;
  iDPropertyMedia?: IMedia | null;
}

export class Property implements IProperty {
  constructor(
    public id?: number,
    public iDProperty?: number,
    public type?: string | null,
    public description?: string | null,
    public hasHouseBuilt?: boolean | null,
    public propertySize?: number | null,
    public iDPropertyMedia?: IMedia | null
  ) {
    this.hasHouseBuilt = this.hasHouseBuilt ?? false;
  }
}

export function getPropertyIdentifier(property: IProperty): number | undefined {
  return property.id;
}
