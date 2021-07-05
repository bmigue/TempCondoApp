import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISysLog, SysLog } from '../sys-log.model';

import { SysLogService } from './sys-log.service';

describe('Service Tests', () => {
  describe('SysLog Service', () => {
    let service: SysLogService;
    let httpMock: HttpTestingController;
    let elemDefault: ISysLog;
    let expectedResult: ISysLog | ISysLog[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SysLogService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDSysLog: 0,
        logDateTime: currentDate,
        action: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            logDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SysLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            logDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            logDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new SysLog()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SysLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDSysLog: 1,
            logDateTime: currentDate.format(DATE_TIME_FORMAT),
            action: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            logDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SysLog', () => {
        const patchObject = Object.assign(
          {
            iDSysLog: 1,
          },
          new SysLog()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            logDateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SysLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDSysLog: 1,
            logDateTime: currentDate.format(DATE_TIME_FORMAT),
            action: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            logDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SysLog', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSysLogToCollectionIfMissing', () => {
        it('should add a SysLog to an empty array', () => {
          const sysLog: ISysLog = { id: 123 };
          expectedResult = service.addSysLogToCollectionIfMissing([], sysLog);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sysLog);
        });

        it('should not add a SysLog to an array that contains it', () => {
          const sysLog: ISysLog = { id: 123 };
          const sysLogCollection: ISysLog[] = [
            {
              ...sysLog,
            },
            { id: 456 },
          ];
          expectedResult = service.addSysLogToCollectionIfMissing(sysLogCollection, sysLog);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SysLog to an array that doesn't contain it", () => {
          const sysLog: ISysLog = { id: 123 };
          const sysLogCollection: ISysLog[] = [{ id: 456 }];
          expectedResult = service.addSysLogToCollectionIfMissing(sysLogCollection, sysLog);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sysLog);
        });

        it('should add only unique SysLog to an array', () => {
          const sysLogArray: ISysLog[] = [{ id: 123 }, { id: 456 }, { id: 75826 }];
          const sysLogCollection: ISysLog[] = [{ id: 123 }];
          expectedResult = service.addSysLogToCollectionIfMissing(sysLogCollection, ...sysLogArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sysLog: ISysLog = { id: 123 };
          const sysLog2: ISysLog = { id: 456 };
          expectedResult = service.addSysLogToCollectionIfMissing([], sysLog, sysLog2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sysLog);
          expect(expectedResult).toContain(sysLog2);
        });

        it('should accept null and undefined values', () => {
          const sysLog: ISysLog = { id: 123 };
          expectedResult = service.addSysLogToCollectionIfMissing([], null, sysLog, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sysLog);
        });

        it('should return initial array if no SysLog is added', () => {
          const sysLogCollection: ISysLog[] = [{ id: 123 }];
          expectedResult = service.addSysLogToCollectionIfMissing(sysLogCollection, undefined, null);
          expect(expectedResult).toEqual(sysLogCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
