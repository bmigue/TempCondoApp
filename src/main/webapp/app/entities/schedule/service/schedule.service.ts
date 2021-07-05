import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISchedule, getScheduleIdentifier } from '../schedule.model';

export type EntityResponseType = HttpResponse<ISchedule>;
export type EntityArrayResponseType = HttpResponse<ISchedule[]>;

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/schedules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(schedule: ISchedule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedule);
    return this.http
      .post<ISchedule>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(schedule: ISchedule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedule);
    return this.http
      .put<ISchedule>(`${this.resourceUrl}/${getScheduleIdentifier(schedule) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(schedule: ISchedule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(schedule);
    return this.http
      .patch<ISchedule>(`${this.resourceUrl}/${getScheduleIdentifier(schedule) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISchedule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISchedule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addScheduleToCollectionIfMissing(scheduleCollection: ISchedule[], ...schedulesToCheck: (ISchedule | null | undefined)[]): ISchedule[] {
    const schedules: ISchedule[] = schedulesToCheck.filter(isPresent);
    if (schedules.length > 0) {
      const scheduleCollectionIdentifiers = scheduleCollection.map(scheduleItem => getScheduleIdentifier(scheduleItem)!);
      const schedulesToAdd = schedules.filter(scheduleItem => {
        const scheduleIdentifier = getScheduleIdentifier(scheduleItem);
        if (scheduleIdentifier == null || scheduleCollectionIdentifiers.includes(scheduleIdentifier)) {
          return false;
        }
        scheduleCollectionIdentifiers.push(scheduleIdentifier);
        return true;
      });
      return [...schedulesToAdd, ...scheduleCollection];
    }
    return scheduleCollection;
  }

  protected convertDateFromClient(schedule: ISchedule): ISchedule {
    return Object.assign({}, schedule, {
      inDateTime: schedule.inDateTime?.isValid() ? schedule.inDateTime.toJSON() : undefined,
      outDateTime: schedule.outDateTime?.isValid() ? schedule.outDateTime.toJSON() : undefined,
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
      res.body.forEach((schedule: ISchedule) => {
        schedule.inDateTime = schedule.inDateTime ? dayjs(schedule.inDateTime) : undefined;
        schedule.outDateTime = schedule.outDateTime ? dayjs(schedule.outDateTime) : undefined;
      });
    }
    return res;
  }
}
