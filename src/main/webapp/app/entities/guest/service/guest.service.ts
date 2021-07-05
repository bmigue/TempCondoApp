import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGuest, getGuestIdentifier } from '../guest.model';

export type EntityResponseType = HttpResponse<IGuest>;
export type EntityArrayResponseType = HttpResponse<IGuest[]>;

@Injectable({ providedIn: 'root' })
export class GuestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/guests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(guest: IGuest): Observable<EntityResponseType> {
    return this.http.post<IGuest>(this.resourceUrl, guest, { observe: 'response' });
  }

  update(guest: IGuest): Observable<EntityResponseType> {
    return this.http.put<IGuest>(`${this.resourceUrl}/${getGuestIdentifier(guest) as number}`, guest, { observe: 'response' });
  }

  partialUpdate(guest: IGuest): Observable<EntityResponseType> {
    return this.http.patch<IGuest>(`${this.resourceUrl}/${getGuestIdentifier(guest) as number}`, guest, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGuest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGuest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGuestToCollectionIfMissing(guestCollection: IGuest[], ...guestsToCheck: (IGuest | null | undefined)[]): IGuest[] {
    const guests: IGuest[] = guestsToCheck.filter(isPresent);
    if (guests.length > 0) {
      const guestCollectionIdentifiers = guestCollection.map(guestItem => getGuestIdentifier(guestItem)!);
      const guestsToAdd = guests.filter(guestItem => {
        const guestIdentifier = getGuestIdentifier(guestItem);
        if (guestIdentifier == null || guestCollectionIdentifiers.includes(guestIdentifier)) {
          return false;
        }
        guestCollectionIdentifiers.push(guestIdentifier);
        return true;
      });
      return [...guestsToAdd, ...guestCollection];
    }
    return guestCollection;
  }
}
