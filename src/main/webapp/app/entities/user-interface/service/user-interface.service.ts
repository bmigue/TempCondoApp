import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserInterface, getUserInterfaceIdentifier } from '../user-interface.model';

export type EntityResponseType = HttpResponse<IUserInterface>;
export type EntityArrayResponseType = HttpResponse<IUserInterface[]>;

@Injectable({ providedIn: 'root' })
export class UserInterfaceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-interfaces');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userInterface: IUserInterface): Observable<EntityResponseType> {
    return this.http.post<IUserInterface>(this.resourceUrl, userInterface, { observe: 'response' });
  }

  update(userInterface: IUserInterface): Observable<EntityResponseType> {
    return this.http.put<IUserInterface>(`${this.resourceUrl}/${getUserInterfaceIdentifier(userInterface) as number}`, userInterface, {
      observe: 'response',
    });
  }

  partialUpdate(userInterface: IUserInterface): Observable<EntityResponseType> {
    return this.http.patch<IUserInterface>(`${this.resourceUrl}/${getUserInterfaceIdentifier(userInterface) as number}`, userInterface, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserInterface>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserInterface[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserInterfaceToCollectionIfMissing(
    userInterfaceCollection: IUserInterface[],
    ...userInterfacesToCheck: (IUserInterface | null | undefined)[]
  ): IUserInterface[] {
    const userInterfaces: IUserInterface[] = userInterfacesToCheck.filter(isPresent);
    if (userInterfaces.length > 0) {
      const userInterfaceCollectionIdentifiers = userInterfaceCollection.map(
        userInterfaceItem => getUserInterfaceIdentifier(userInterfaceItem)!
      );
      const userInterfacesToAdd = userInterfaces.filter(userInterfaceItem => {
        const userInterfaceIdentifier = getUserInterfaceIdentifier(userInterfaceItem);
        if (userInterfaceIdentifier == null || userInterfaceCollectionIdentifiers.includes(userInterfaceIdentifier)) {
          return false;
        }
        userInterfaceCollectionIdentifiers.push(userInterfaceIdentifier);
        return true;
      });
      return [...userInterfacesToAdd, ...userInterfaceCollection];
    }
    return userInterfaceCollection;
  }
}
