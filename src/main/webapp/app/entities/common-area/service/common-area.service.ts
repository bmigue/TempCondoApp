import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommonArea, getCommonAreaIdentifier } from '../common-area.model';

export type EntityResponseType = HttpResponse<ICommonArea>;
export type EntityArrayResponseType = HttpResponse<ICommonArea[]>;

@Injectable({ providedIn: 'root' })
export class CommonAreaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/common-areas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(commonArea: ICommonArea): Observable<EntityResponseType> {
    return this.http.post<ICommonArea>(this.resourceUrl, commonArea, { observe: 'response' });
  }

  update(commonArea: ICommonArea): Observable<EntityResponseType> {
    return this.http.put<ICommonArea>(`${this.resourceUrl}/${getCommonAreaIdentifier(commonArea) as number}`, commonArea, {
      observe: 'response',
    });
  }

  partialUpdate(commonArea: ICommonArea): Observable<EntityResponseType> {
    return this.http.patch<ICommonArea>(`${this.resourceUrl}/${getCommonAreaIdentifier(commonArea) as number}`, commonArea, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommonArea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommonArea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommonAreaToCollectionIfMissing(
    commonAreaCollection: ICommonArea[],
    ...commonAreasToCheck: (ICommonArea | null | undefined)[]
  ): ICommonArea[] {
    const commonAreas: ICommonArea[] = commonAreasToCheck.filter(isPresent);
    if (commonAreas.length > 0) {
      const commonAreaCollectionIdentifiers = commonAreaCollection.map(commonAreaItem => getCommonAreaIdentifier(commonAreaItem)!);
      const commonAreasToAdd = commonAreas.filter(commonAreaItem => {
        const commonAreaIdentifier = getCommonAreaIdentifier(commonAreaItem);
        if (commonAreaIdentifier == null || commonAreaCollectionIdentifiers.includes(commonAreaIdentifier)) {
          return false;
        }
        commonAreaCollectionIdentifiers.push(commonAreaIdentifier);
        return true;
      });
      return [...commonAreasToAdd, ...commonAreaCollection];
    }
    return commonAreaCollection;
  }
}
