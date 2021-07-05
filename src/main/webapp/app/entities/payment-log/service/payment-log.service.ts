import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentLog, getPaymentLogIdentifier } from '../payment-log.model';

export type EntityResponseType = HttpResponse<IPaymentLog>;
export type EntityArrayResponseType = HttpResponse<IPaymentLog[]>;

@Injectable({ providedIn: 'root' })
export class PaymentLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentLog: IPaymentLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentLog);
    return this.http
      .post<IPaymentLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paymentLog: IPaymentLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentLog);
    return this.http
      .put<IPaymentLog>(`${this.resourceUrl}/${getPaymentLogIdentifier(paymentLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paymentLog: IPaymentLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentLog);
    return this.http
      .patch<IPaymentLog>(`${this.resourceUrl}/${getPaymentLogIdentifier(paymentLog) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPaymentLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaymentLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentLogToCollectionIfMissing(
    paymentLogCollection: IPaymentLog[],
    ...paymentLogsToCheck: (IPaymentLog | null | undefined)[]
  ): IPaymentLog[] {
    const paymentLogs: IPaymentLog[] = paymentLogsToCheck.filter(isPresent);
    if (paymentLogs.length > 0) {
      const paymentLogCollectionIdentifiers = paymentLogCollection.map(paymentLogItem => getPaymentLogIdentifier(paymentLogItem)!);
      const paymentLogsToAdd = paymentLogs.filter(paymentLogItem => {
        const paymentLogIdentifier = getPaymentLogIdentifier(paymentLogItem);
        if (paymentLogIdentifier == null || paymentLogCollectionIdentifiers.includes(paymentLogIdentifier)) {
          return false;
        }
        paymentLogCollectionIdentifiers.push(paymentLogIdentifier);
        return true;
      });
      return [...paymentLogsToAdd, ...paymentLogCollection];
    }
    return paymentLogCollection;
  }

  protected convertDateFromClient(paymentLog: IPaymentLog): IPaymentLog {
    return Object.assign({}, paymentLog, {
      dueDate: paymentLog.dueDate?.isValid() ? paymentLog.dueDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dueDate = res.body.dueDate ? dayjs(res.body.dueDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paymentLog: IPaymentLog) => {
        paymentLog.dueDate = paymentLog.dueDate ? dayjs(paymentLog.dueDate) : undefined;
      });
    }
    return res;
  }
}
