import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserProfile, getUserProfileIdentifier } from '../user-profile.model';

export type EntityResponseType = HttpResponse<IUserProfile>;
export type EntityArrayResponseType = HttpResponse<IUserProfile[]>;

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-profiles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userProfile: IUserProfile): Observable<EntityResponseType> {
    return this.http.post<IUserProfile>(this.resourceUrl, userProfile, { observe: 'response' });
  }

  update(userProfile: IUserProfile): Observable<EntityResponseType> {
    return this.http.put<IUserProfile>(`${this.resourceUrl}/${getUserProfileIdentifier(userProfile) as number}`, userProfile, {
      observe: 'response',
    });
  }

  partialUpdate(userProfile: IUserProfile): Observable<EntityResponseType> {
    return this.http.patch<IUserProfile>(`${this.resourceUrl}/${getUserProfileIdentifier(userProfile) as number}`, userProfile, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserProfile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserProfile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserProfileToCollectionIfMissing(
    userProfileCollection: IUserProfile[],
    ...userProfilesToCheck: (IUserProfile | null | undefined)[]
  ): IUserProfile[] {
    const userProfiles: IUserProfile[] = userProfilesToCheck.filter(isPresent);
    if (userProfiles.length > 0) {
      const userProfileCollectionIdentifiers = userProfileCollection.map(userProfileItem => getUserProfileIdentifier(userProfileItem)!);
      const userProfilesToAdd = userProfiles.filter(userProfileItem => {
        const userProfileIdentifier = getUserProfileIdentifier(userProfileItem);
        if (userProfileIdentifier == null || userProfileCollectionIdentifiers.includes(userProfileIdentifier)) {
          return false;
        }
        userProfileCollectionIdentifiers.push(userProfileIdentifier);
        return true;
      });
      return [...userProfilesToAdd, ...userProfileCollection];
    }
    return userProfileCollection;
  }
}
