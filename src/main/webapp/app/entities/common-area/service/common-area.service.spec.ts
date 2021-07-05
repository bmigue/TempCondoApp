import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommonArea, CommonArea } from '../common-area.model';

import { CommonAreaService } from './common-area.service';

describe('Service Tests', () => {
  describe('CommonArea Service', () => {
    let service: CommonAreaService;
    let httpMock: HttpTestingController;
    let elemDefault: ICommonArea;
    let expectedResult: ICommonArea | ICommonArea[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CommonAreaService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDCommonArea: 0,
        status: 'AAAAAAA',
        name: 'AAAAAAA',
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

      it('should create a CommonArea', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CommonArea()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CommonArea', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCommonArea: 1,
            status: 'BBBBBB',
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CommonArea', () => {
        const patchObject = Object.assign({}, new CommonArea());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CommonArea', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDCommonArea: 1,
            status: 'BBBBBB',
            name: 'BBBBBB',
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

      it('should delete a CommonArea', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCommonAreaToCollectionIfMissing', () => {
        it('should add a CommonArea to an empty array', () => {
          const commonArea: ICommonArea = { id: 123 };
          expectedResult = service.addCommonAreaToCollectionIfMissing([], commonArea);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commonArea);
        });

        it('should not add a CommonArea to an array that contains it', () => {
          const commonArea: ICommonArea = { id: 123 };
          const commonAreaCollection: ICommonArea[] = [
            {
              ...commonArea,
            },
            { id: 456 },
          ];
          expectedResult = service.addCommonAreaToCollectionIfMissing(commonAreaCollection, commonArea);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CommonArea to an array that doesn't contain it", () => {
          const commonArea: ICommonArea = { id: 123 };
          const commonAreaCollection: ICommonArea[] = [{ id: 456 }];
          expectedResult = service.addCommonAreaToCollectionIfMissing(commonAreaCollection, commonArea);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commonArea);
        });

        it('should add only unique CommonArea to an array', () => {
          const commonAreaArray: ICommonArea[] = [{ id: 123 }, { id: 456 }, { id: 50895 }];
          const commonAreaCollection: ICommonArea[] = [{ id: 123 }];
          expectedResult = service.addCommonAreaToCollectionIfMissing(commonAreaCollection, ...commonAreaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const commonArea: ICommonArea = { id: 123 };
          const commonArea2: ICommonArea = { id: 456 };
          expectedResult = service.addCommonAreaToCollectionIfMissing([], commonArea, commonArea2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commonArea);
          expect(expectedResult).toContain(commonArea2);
        });

        it('should accept null and undefined values', () => {
          const commonArea: ICommonArea = { id: 123 };
          expectedResult = service.addCommonAreaToCollectionIfMissing([], null, commonArea, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commonArea);
        });

        it('should return initial array if no CommonArea is added', () => {
          const commonAreaCollection: ICommonArea[] = [{ id: 123 }];
          expectedResult = service.addCommonAreaToCollectionIfMissing(commonAreaCollection, undefined, null);
          expect(expectedResult).toEqual(commonAreaCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
