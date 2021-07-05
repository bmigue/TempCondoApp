import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExceptionTable, ExceptionTable } from '../exception-table.model';

import { ExceptionTableService } from './exception-table.service';

describe('Service Tests', () => {
  describe('ExceptionTable Service', () => {
    let service: ExceptionTableService;
    let httpMock: HttpTestingController;
    let elemDefault: IExceptionTable;
    let expectedResult: IExceptionTable | IExceptionTable[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ExceptionTableService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDException: 0,
        message: 'AAAAAAA',
        number: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ExceptionTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ExceptionTable()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ExceptionTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDException: 1,
            message: 'BBBBBB',
            number: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ExceptionTable', () => {
        const patchObject = Object.assign({}, new ExceptionTable());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ExceptionTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDException: 1,
            message: 'BBBBBB',
            number: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ExceptionTable', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addExceptionTableToCollectionIfMissing', () => {
        it('should add a ExceptionTable to an empty array', () => {
          const exceptionTable: IExceptionTable = { id: 123 };
          expectedResult = service.addExceptionTableToCollectionIfMissing([], exceptionTable);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exceptionTable);
        });

        it('should not add a ExceptionTable to an array that contains it', () => {
          const exceptionTable: IExceptionTable = { id: 123 };
          const exceptionTableCollection: IExceptionTable[] = [
            {
              ...exceptionTable,
            },
            { id: 456 },
          ];
          expectedResult = service.addExceptionTableToCollectionIfMissing(exceptionTableCollection, exceptionTable);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ExceptionTable to an array that doesn't contain it", () => {
          const exceptionTable: IExceptionTable = { id: 123 };
          const exceptionTableCollection: IExceptionTable[] = [{ id: 456 }];
          expectedResult = service.addExceptionTableToCollectionIfMissing(exceptionTableCollection, exceptionTable);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exceptionTable);
        });

        it('should add only unique ExceptionTable to an array', () => {
          const exceptionTableArray: IExceptionTable[] = [{ id: 123 }, { id: 456 }, { id: 9766 }];
          const exceptionTableCollection: IExceptionTable[] = [{ id: 123 }];
          expectedResult = service.addExceptionTableToCollectionIfMissing(exceptionTableCollection, ...exceptionTableArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const exceptionTable: IExceptionTable = { id: 123 };
          const exceptionTable2: IExceptionTable = { id: 456 };
          expectedResult = service.addExceptionTableToCollectionIfMissing([], exceptionTable, exceptionTable2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exceptionTable);
          expect(expectedResult).toContain(exceptionTable2);
        });

        it('should accept null and undefined values', () => {
          const exceptionTable: IExceptionTable = { id: 123 };
          expectedResult = service.addExceptionTableToCollectionIfMissing([], null, exceptionTable, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exceptionTable);
        });

        it('should return initial array if no ExceptionTable is added', () => {
          const exceptionTableCollection: IExceptionTable[] = [{ id: 123 }];
          expectedResult = service.addExceptionTableToCollectionIfMissing(exceptionTableCollection, undefined, null);
          expect(expectedResult).toEqual(exceptionTableCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
