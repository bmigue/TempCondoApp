import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdminWall, getAdminWallIdentifier } from '../admin-wall.model';

export type EntityResponseType = HttpResponse<IAdminWall>;
export type EntityArrayResponseType = HttpResponse<IAdminWall[]>;

@Injectable({ providedIn: 'root' })
export class AdminWallService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/admin-walls');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adminWall: IAdminWall): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adminWall);
    return this.http
      .post<IAdminWall>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(adminWall: IAdminWall): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adminWall);
    return this.http
      .put<IAdminWall>(`${this.resourceUrl}/${getAdminWallIdentifier(adminWall) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(adminWall: IAdminWall): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adminWall);
    return this.http
      .patch<IAdminWall>(`${this.resourceUrl}/${getAdminWallIdentifier(adminWall) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAdminWall>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAdminWall[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdminWallToCollectionIfMissing(
    adminWallCollection: IAdminWall[],
    ...adminWallsToCheck: (IAdminWall | null | undefined)[]
  ): IAdminWall[] {
    const adminWalls: IAdminWall[] = adminWallsToCheck.filter(isPresent);
    if (adminWalls.length > 0) {
      const adminWallCollectionIdentifiers = adminWallCollection.map(adminWallItem => getAdminWallIdentifier(adminWallItem)!);
      const adminWallsToAdd = adminWalls.filter(adminWallItem => {
        const adminWallIdentifier = getAdminWallIdentifier(adminWallItem);
        if (adminWallIdentifier == null || adminWallCollectionIdentifiers.includes(adminWallIdentifier)) {
          return false;
        }
        adminWallCollectionIdentifiers.push(adminWallIdentifier);
        return true;
      });
      return [...adminWallsToAdd, ...adminWallCollection];
    }
    return adminWallCollection;
  }

  protected convertDateFromClient(adminWall: IAdminWall): IAdminWall {
    return Object.assign({}, adminWall, {
      postDate: adminWall.postDate?.isValid() ? adminWall.postDate.toJSON() : undefined,
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
      res.body.forEach((adminWall: IAdminWall) => {
        adminWall.postDate = adminWall.postDate ? dayjs(adminWall.postDate) : undefined;
      });
    }
    return res;
  }
}
