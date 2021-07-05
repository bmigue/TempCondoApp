import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProperty, getPropertyIdentifier } from '../property.model';

export type EntityResponseType = HttpResponse<IProperty>;
export type EntityArrayResponseType = HttpResponse<IProperty[]>;

@Injectable({ providedIn: 'root' })
export class PropertyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/properties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(property: IProperty): Observable<EntityResponseType> {
    return this.http.post<IProperty>(this.resourceUrl, property, { observe: 'response' });
  }

  update(property: IProperty): Observable<EntityResponseType> {
    return this.http.put<IProperty>(`${this.resourceUrl}/${getPropertyIdentifier(property) as number}`, property, { observe: 'response' });
  }

  partialUpdate(property: IProperty): Observable<EntityResponseType> {
    return this.http.patch<IProperty>(`${this.resourceUrl}/${getPropertyIdentifier(property) as number}`, property, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProperty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProperty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPropertyToCollectionIfMissing(propertyCollection: IProperty[], ...propertiesToCheck: (IProperty | null | undefined)[]): IProperty[] {
    const properties: IProperty[] = propertiesToCheck.filter(isPresent);
    if (properties.length > 0) {
      const propertyCollectionIdentifiers = propertyCollection.map(propertyItem => getPropertyIdentifier(propertyItem)!);
      const propertiesToAdd = properties.filter(propertyItem => {
        const propertyIdentifier = getPropertyIdentifier(propertyItem);
        if (propertyIdentifier == null || propertyCollectionIdentifiers.includes(propertyIdentifier)) {
          return false;
        }
        propertyCollectionIdentifiers.push(propertyIdentifier);
        return true;
      });
      return [...propertiesToAdd, ...propertyCollection];
    }
    return propertyCollection;
  }
}
