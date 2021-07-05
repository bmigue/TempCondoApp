import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICondo, getCondoIdentifier } from '../condo.model';

export type EntityResponseType = HttpResponse<ICondo>;
export type EntityArrayResponseType = HttpResponse<ICondo[]>;

@Injectable({ providedIn: 'root' })
export class CondoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/condos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(condo: ICondo): Observable<EntityResponseType> {
    return this.http.post<ICondo>(this.resourceUrl, condo, { observe: 'response' });
  }

  update(condo: ICondo): Observable<EntityResponseType> {
    return this.http.put<ICondo>(`${this.resourceUrl}/${getCondoIdentifier(condo) as number}`, condo, { observe: 'response' });
  }

  partialUpdate(condo: ICondo): Observable<EntityResponseType> {
    return this.http.patch<ICondo>(`${this.resourceUrl}/${getCondoIdentifier(condo) as number}`, condo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICondo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICondo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCondoToCollectionIfMissing(condoCollection: ICondo[], ...condosToCheck: (ICondo | null | undefined)[]): ICondo[] {
    const condos: ICondo[] = condosToCheck.filter(isPresent);
    if (condos.length > 0) {
      const condoCollectionIdentifiers = condoCollection.map(condoItem => getCondoIdentifier(condoItem)!);
      const condosToAdd = condos.filter(condoItem => {
        const condoIdentifier = getCondoIdentifier(condoItem);
        if (condoIdentifier == null || condoCollectionIdentifiers.includes(condoIdentifier)) {
          return false;
        }
        condoCollectionIdentifiers.push(condoIdentifier);
        return true;
      });
      return [...condosToAdd, ...condoCollection];
    }
    return condoCollection;
  }
}
