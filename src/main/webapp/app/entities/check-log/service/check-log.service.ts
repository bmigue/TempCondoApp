import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckLog, getCheckLogIdentifier } from '../check-log.model';

export type EntityResponseType = HttpResponse<ICheckLog>;
export type EntityArrayResponseType = HttpResponse<ICheckLog[]>;

@Injectable({ providedIn: 'root' })
export class CheckLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/check-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(checkLog: ICheckLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLog);
    return this.http
      .post<ICheckLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(checkLog: ICheckLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLog);
    return this.http
      .put<ICheckLog>(`${this.resourceUrl}/${getCheckLogIdentifier(checkLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(checkLog: ICheckLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLog);
    return this.http
      .patch<ICheckLog>(`${this.resourceUrl}/${getCheckLogIdentifier(checkLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICheckLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICheckLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCheckLogToCollectionIfMissing(checkLogCollection: ICheckLog[], ...checkLogsToCheck: (ICheckLog | null | undefined)[]): ICheckLog[] {
    const checkLogs: ICheckLog[] = checkLogsToCheck.filter(isPresent);
    if (checkLogs.length > 0) {
      const checkLogCollectionIdentifiers = checkLogCollection.map(checkLogItem => getCheckLogIdentifier(checkLogItem)!);
      const checkLogsToAdd = checkLogs.filter(checkLogItem => {
        const checkLogIdentifier = getCheckLogIdentifier(checkLogItem);
        if (checkLogIdentifier == null || checkLogCollectionIdentifiers.includes(checkLogIdentifier)) {
          return false;
        }
        checkLogCollectionIdentifiers.push(checkLogIdentifier);
        return true;
      });
      return [...checkLogsToAdd, ...checkLogCollection];
    }
    return checkLogCollection;
  }

  protected convertDateFromClient(checkLog: ICheckLog): ICheckLog {
    return Object.assign({}, checkLog, {
      inDateTime: checkLog.inDateTime?.isValid() ? checkLog.inDateTime.toJSON() : undefined,
      outDateTime: checkLog.outDateTime?.isValid() ? checkLog.outDateTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.inDateTime = res.body.inDateTime ? dayjs(res.body.inDateTime) : undefined;
      res.body.outDateTime = res.body.outDateTime ? dayjs(res.body.outDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((checkLog: ICheckLog) => {
        checkLog.inDateTime = checkLog.inDateTime ? dayjs(checkLog.inDateTime) : undefined;
        checkLog.outDateTime = checkLog.outDateTime ? dayjs(checkLog.outDateTime) : undefined;
      });
    }
    return res;
  }
}
