import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISysLog, getSysLogIdentifier } from '../sys-log.model';

export type EntityResponseType = HttpResponse<ISysLog>;
export type EntityArrayResponseType = HttpResponse<ISysLog[]>;

@Injectable({ providedIn: 'root' })
export class SysLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sys-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sysLog: ISysLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sysLog);
    return this.http
      .post<ISysLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sysLog: ISysLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sysLog);
    return this.http
      .put<ISysLog>(`${this.resourceUrl}/${getSysLogIdentifier(sysLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sysLog: ISysLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sysLog);
    return this.http
      .patch<ISysLog>(`${this.resourceUrl}/${getSysLogIdentifier(sysLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISysLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISysLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSysLogToCollectionIfMissing(sysLogCollection: ISysLog[], ...sysLogsToCheck: (ISysLog | null | undefined)[]): ISysLog[] {
    const sysLogs: ISysLog[] = sysLogsToCheck.filter(isPresent);
    if (sysLogs.length > 0) {
      const sysLogCollectionIdentifiers = sysLogCollection.map(sysLogItem => getSysLogIdentifier(sysLogItem)!);
      const sysLogsToAdd = sysLogs.filter(sysLogItem => {
        const sysLogIdentifier = getSysLogIdentifier(sysLogItem);
        if (sysLogIdentifier == null || sysLogCollectionIdentifiers.includes(sysLogIdentifier)) {
          return false;
        }
        sysLogCollectionIdentifiers.push(sysLogIdentifier);
        return true;
      });
      return [...sysLogsToAdd, ...sysLogCollection];
    }
    return sysLogCollection;
  }

  protected convertDateFromClient(sysLog: ISysLog): ISysLog {
    return Object.assign({}, sysLog, {
      logDateTime: sysLog.logDateTime?.isValid() ? sysLog.logDateTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.logDateTime = res.body.logDateTime ? dayjs(res.body.logDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sysLog: ISysLog) => {
        sysLog.logDateTime = sysLog.logDateTime ? dayjs(sysLog.logDateTime) : undefined;
      });
    }
    return res;
  }
}
