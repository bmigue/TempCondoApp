jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PropertyService } from '../service/property.service';
import { IProperty, Property } from '../property.model';
import { IMedia } from 'app/entities/media/media.model';
import { MediaService } from 'app/entities/media/service/media.service';

import { PropertyUpdateComponent } from './property-update.component';

describe('Component Tests', () => {
  describe('Property Management Update Component', () => {
    let comp: PropertyUpdateComponent;
    let fixture: ComponentFixture<PropertyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let propertyService: PropertyService;
    let mediaService: MediaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PropertyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PropertyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PropertyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      propertyService = TestBed.inject(PropertyService);
      mediaService = TestBed.inject(MediaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call iDPropertyMedia query and add missing value', () => {
        const property: IProperty = { id: 456 };
        const iDPropertyMedia: IMedia = { id: 8179 };
        property.iDPropertyMedia = iDPropertyMedia;

        const iDPropertyMediaCollection: IMedia[] = [{ id: 28623 }];
        jest.spyOn(mediaService, 'query').mockReturnValue(of(new HttpResponse({ body: iDPropertyMediaCollection })));
        const expectedCollection: IMedia[] = [iDPropertyMedia, ...iDPropertyMediaCollection];
        jest.spyOn(mediaService, 'addMediaToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ property });
        comp.ngOnInit();

        expect(mediaService.query).toHaveBeenCalled();
        expect(mediaService.addMediaToCollectionIfMissing).toHaveBeenCalledWith(iDPropertyMediaCollection, iDPropertyMedia);
        expect(comp.iDPropertyMediasCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const property: IProperty = { id: 456 };
        const iDPropertyMedia: IMedia = { id: 40192 };
        property.iDPropertyMedia = iDPropertyMedia;

        activatedRoute.data = of({ property });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(property));
        expect(comp.iDPropertyMediasCollection).toContain(iDPropertyMedia);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Property>>();
        const property = { id: 123 };
        jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ property });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: property }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(propertyService.update).toHaveBeenCalledWith(property);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Property>>();
        const property = new Property();
        jest.spyOn(propertyService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ property });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: property }));
        saveSubject.complete();

        // THEN
        expect(propertyService.create).toHaveBeenCalledWith(property);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Property>>();
        const property = { id: 123 };
        jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ property });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(propertyService.update).toHaveBeenCalledWith(property);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMediaById', () => {
        it('Should return tracked Media primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMediaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
