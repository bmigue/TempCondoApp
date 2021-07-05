import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICheckLog, CheckLog } from '../check-log.model';

import { CheckLogService } from './check-log.service';

describe('Service Tests', () => {
  describe('CheckLog Service', () => {
    let service: CheckLogService;
    let httpMock: HttpTestingController;
    let elemDefault: ICheckLog;
    let expectedResult: ICheckLog | ICheckLog[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CheckLogService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDCheckLog: 0,
        inDateTime: currentDate,
        outDateTime: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a CheckLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new CheckLog()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CheckLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCheckLog: 1,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CheckLog', () => {
        const patchObject = Object.assign(
          {
            iDCheckLog: 1,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          new CheckLog()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CheckLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCheckLog: 1,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a CheckLog', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCheckLogToCollectionIfMissing', () => {
        it('should add a CheckLog to an empty array', () => {
          const checkLog: ICheckLog = { id: 123 };
          expectedResult = service.addCheckLogToCollectionIfMissing([], checkLog);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(checkLog);
        });

        it('should not add a CheckLog to an array that contains it', () => {
          const checkLog: ICheckLog = { id: 123 };
          const checkLogCollection: ICheckLog[] = [
            {
              ...checkLog,
            },
            { id: 456 },
          ];
          expectedResult = service.addCheckLogToCollectionIfMissing(checkLogCollection, checkLog);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CheckLog to an array that doesn't contain it", () => {
          const checkLog: ICheckLog = { id: 123 };
          const checkLogCollection: ICheckLog[] = [{ id: 456 }];
          expectedResult = service.addCheckLogToCollectionIfMissing(checkLogCollection, checkLog);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(checkLog);
        });

        it('should add only unique CheckLog to an array', () => {
          const checkLogArray: ICheckLog[] = [{ id: 123 }, { id: 456 }, { id: 61444 }];
          const checkLogCollection: ICheckLog[] = [{ id: 123 }];
          expectedResult = service.addCheckLogToCollectionIfMissing(checkLogCollection, ...checkLogArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const checkLog: ICheckLog = { id: 123 };
          const checkLog2: ICheckLog = { id: 456 };
          expectedResult = service.addCheckLogToCollectionIfMissing([], checkLog, checkLog2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(checkLog);
          expect(expectedResult).toContain(checkLog2);
        });

        it('should accept null and undefined values', () => {
          const checkLog: ICheckLog = { id: 123 };
          expectedResult = service.addCheckLogToCollectionIfMissing([], null, checkLog, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(checkLog);
        });

        it('should return initial array if no CheckLog is added', () => {
          const checkLogCollection: ICheckLog[] = [{ id: 123 }];
          expectedResult = service.addCheckLogToCollectionIfMissing(checkLogCollection, undefined, null);
          expect(expectedResult).toEqual(checkLogCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
