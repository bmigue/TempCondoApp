import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICondo, Condo } from '../condo.model';

import { CondoService } from './condo.service';

describe('Service Tests', () => {
  describe('Condo Service', () => {
    let service: CondoService;
    let httpMock: HttpTestingController;
    let elemDefault: ICondo;
    let expectedResult: ICondo | ICondo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CondoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDCondo: 0,
        nombre: 'AAAAAAA',
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

      it('should create a Condo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Condo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Condo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCondo: 1,
            nombre: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Condo', () => {
        const patchObject = Object.assign({}, new Condo());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Condo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCondo: 1,
            nombre: 'BBBBBB',
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

      it('should delete a Condo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCondoToCollectionIfMissing', () => {
        it('should add a Condo to an empty array', () => {
          const condo: ICondo = { id: 123 };
          expectedResult = service.addCondoToCollectionIfMissing([], condo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(condo);
        });

        it('should not add a Condo to an array that contains it', () => {
          const condo: ICondo = { id: 123 };
          const condoCollection: ICondo[] = [
            {
              ...condo,
            },
            { id: 456 },
          ];
          expectedResult = service.addCondoToCollectionIfMissing(condoCollection, condo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Condo to an array that doesn't contain it", () => {
          const condo: ICondo = { id: 123 };
          const condoCollection: ICondo[] = [{ id: 456 }];
          expectedResult = service.addCondoToCollectionIfMissing(condoCollection, condo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(condo);
        });

        it('should add only unique Condo to an array', () => {
          const condoArray: ICondo[] = [{ id: 123 }, { id: 456 }, { id: 95087 }];
          const condoCollection: ICondo[] = [{ id: 123 }];
          expectedResult = service.addCondoToCollectionIfMissing(condoCollection, ...condoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const condo: ICondo = { id: 123 };
          const condo2: ICondo = { id: 456 };
          expectedResult = service.addCondoToCollectionIfMissing([], condo, condo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(condo);
          expect(expectedResult).toContain(condo2);
        });

        it('should accept null and undefined values', () => {
          const condo: ICondo = { id: 123 };
          expectedResult = service.addCondoToCollectionIfMissing([], null, condo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(condo);
        });

        it('should return initial array if no Condo is added', () => {
          const condoCollection: ICondo[] = [{ id: 123 }];
          expectedResult = service.addCondoToCollectionIfMissing(condoCollection, undefined, null);
          expect(expectedResult).toEqual(condoCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
