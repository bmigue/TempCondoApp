import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExceptionTable, getExceptionTableIdentifier } from '../exception-table.model';

export type EntityResponseType = HttpResponse<IExceptionTable>;
export type EntityArrayResponseType = HttpResponse<IExceptionTable[]>;

@Injectable({ providedIn: 'root' })
export class ExceptionTableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exception-tables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exceptionTable: IExceptionTable): Observable<EntityResponseType> {
    return this.http.post<IExceptionTable>(this.resourceUrl, exceptionTable, { observe: 'response' });
  }

  update(exceptionTable: IExceptionTable): Observable<EntityResponseType> {
    return this.http.put<IExceptionTable>(`${this.resourceUrl}/${getExceptionTableIdentifier(exceptionTable) as number}`, exceptionTable, {
      observe: 'response',
    });
  }

  partialUpdate(exceptionTable: IExceptionTable): Observable<EntityResponseType> {
    return this.http.patch<IExceptionTable>(
      `${this.resourceUrl}/${getExceptionTableIdentifier(exceptionTable) as number}`,
      exceptionTable,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExceptionTable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExceptionTable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExceptionTableToCollectionIfMissing(
    exceptionTableCollection: IExceptionTable[],
    ...exceptionTablesToCheck: (IExceptionTable | null | undefined)[]
  ): IExceptionTable[] {
    const exceptionTables: IExceptionTable[] = exceptionTablesToCheck.filter(isPresent);
    if (exceptionTables.length > 0) {
      const exceptionTableCollectionIdentifiers = exceptionTableCollection.map(
        exceptionTableItem => getExceptionTableIdentifier(exceptionTableItem)!
      );
      const exceptionTablesToAdd = exceptionTables.filter(exceptionTableItem => {
        const exceptionTableIdentifier = getExceptionTableIdentifier(exceptionTableItem);
        if (exceptionTableIdentifier == null || exceptionTableCollectionIdentifiers.includes(exceptionTableIdentifier)) {
          return false;
        }
        exceptionTableCollectionIdentifiers.push(exceptionTableIdentifier);
        return true;
      });
      return [...exceptionTablesToAdd, ...exceptionTableCollection];
    }
    return exceptionTableCollection;
  }
}
