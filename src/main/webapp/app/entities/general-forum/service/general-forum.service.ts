import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGeneralForum, getGeneralForumIdentifier } from '../general-forum.model';

export type EntityResponseType = HttpResponse<IGeneralForum>;
export type EntityArrayResponseType = HttpResponse<IGeneralForum[]>;

@Injectable({ providedIn: 'root' })
export class GeneralForumService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/general-forums');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(generalForum: IGeneralForum): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(generalForum);
    return this.http
      .post<IGeneralForum>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(generalForum: IGeneralForum): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(generalForum);
    return this.http
      .put<IGeneralForum>(`${this.resourceUrl}/${getGeneralForumIdentifier(generalForum) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(generalForum: IGeneralForum): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(generalForum);
    return this.http
      .patch<IGeneralForum>(`${this.resourceUrl}/${getGeneralForumIdentifier(generalForum) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGeneralForum>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGeneralForum[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGeneralForumToCollectionIfMissing(
    generalForumCollection: IGeneralForum[],
    ...generalForumsToCheck: (IGeneralForum | null | undefined)[]
  ): IGeneralForum[] {
    const generalForums: IGeneralForum[] = generalForumsToCheck.filter(isPresent);
    if (generalForums.length > 0) {
      const generalForumCollectionIdentifiers = generalForumCollection.map(
        generalForumItem => getGeneralForumIdentifier(generalForumItem)!
      );
      const generalForumsToAdd = generalForums.filter(generalForumItem => {
        const generalForumIdentifier = getGeneralForumIdentifier(generalForumItem);
        if (generalForumIdentifier == null || generalForumCollectionIdentifiers.includes(generalForumIdentifier)) {
          return false;
        }
        generalForumCollectionIdentifiers.push(generalForumIdentifier);
        return true;
      });
      return [...generalForumsToAdd, ...generalForumCollection];
    }
    return generalForumCollection;
  }

  protected convertDateFromClient(generalForum: IGeneralForum): IGeneralForum {
    return Object.assign({}, generalForum, {
      postDate: generalForum.postDate?.isValid() ? generalForum.postDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.postDate = res.body.postDate ? dayjs(res.body.postDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((generalForum: IGeneralForum) => {
        generalForum.postDate = generalForum.postDate ? dayjs(generalForum.postDate) : undefined;
      });
    }
    return res;
  }
}
