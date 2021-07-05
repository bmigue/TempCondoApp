import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProperty, Property } from '../property.model';

import { PropertyService } from './property.service';

describe('Service Tests', () => {
  describe('Property Service', () => {
    let service: PropertyService;
    let httpMock: HttpTestingController;
    let elemDefault: IProperty;
    let expectedResult: IProperty | IProperty[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PropertyService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDProperty: 0,
        type: 'AAAAAAA',
        description: 'AAAAAAA',
        hasHouseBuilt: false,
        propertySize: 0,
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

      it('should create a Property', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Property()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Property', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDProperty: 1,
            type: 'BBBBBB',
            description: 'BBBBBB',
            hasHouseBuilt: true,
            propertySize: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Property', () => {
        const patchObject = Object.assign(
          {
            iDProperty: 1,
            type: 'BBBBBB',
            propertySize: 1,
          },
          new Property()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Property', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDProperty: 1,
            type: 'BBBBBB',
            description: 'BBBBBB',
            hasHouseBuilt: true,
            propertySize: 1,
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

      it('should delete a Property', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPropertyToCollectionIfMissing', () => {
        it('should add a Property to an empty array', () => {
          const property: IProperty = { id: 123 };
          expectedResult = service.addPropertyToCollectionIfMissing([], property);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(property);
        });

        it('should not add a Property to an array that contains it', () => {
          const property: IProperty = { id: 123 };
          const propertyCollection: IProperty[] = [
            {
              ...property,
            },
            { id: 456 },
          ];
          expectedResult = service.addPropertyToCollectionIfMissing(propertyCollection, property);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Property to an array that doesn't contain it", () => {
          const property: IProperty = { id: 123 };
          const propertyCollection: IProperty[] = [{ id: 456 }];
          expectedResult = service.addPropertyToCollectionIfMissing(propertyCollection, property);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(property);
        });

        it('should add only unique Property to an array', () => {
          const propertyArray: IProperty[] = [{ id: 123 }, { id: 456 }, { id: 2250 }];
          const propertyCollection: IProperty[] = [{ id: 123 }];
          expectedResult = service.addPropertyToCollectionIfMissing(propertyCollection, ...propertyArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const property: IProperty = { id: 123 };
          const property2: IProperty = { id: 456 };
          expectedResult = service.addPropertyToCollectionIfMissing([], property, property2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(property);
          expect(expectedResult).toContain(property2);
        });

        it('should accept null and undefined values', () => {
          const property: IProperty = { id: 123 };
          expectedResult = service.addPropertyToCollectionIfMissing([], null, property, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(property);
        });

        it('should return initial array if no Property is added', () => {
          const propertyCollection: IProperty[] = [{ id: 123 }];
          expectedResult = service.addPropertyToCollectionIfMissing(propertyCollection, undefined, null);
          expect(expectedResult).toEqual(propertyCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
