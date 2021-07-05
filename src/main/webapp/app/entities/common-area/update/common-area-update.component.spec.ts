jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommonAreaService } from '../service/common-area.service';
import { ICommonArea, CommonArea } from '../common-area.model';
import { IMedia } from 'app/entities/media/media.model';
import { MediaService } from 'app/entities/media/service/media.service';
import { ICondo } from 'app/entities/condo/condo.model';
import { CondoService } from 'app/entities/condo/service/condo.service';

import { CommonAreaUpdateComponent } from './common-area-update.component';

describe('Component Tests', () => {
  describe('CommonArea Management Update Component', () => {
    let comp: CommonAreaUpdateComponent;
    let fixture: ComponentFixture<CommonAreaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commonAreaService: CommonAreaService;
    let mediaService: MediaService;
    let condoService: CondoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommonAreaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommonAreaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommonAreaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commonAreaService = TestBed.inject(CommonAreaService);
      mediaService = TestBed.inject(MediaService);
      condoService = TestBed.inject(CondoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call iDCommonAreaMedia query and add missing value', () => {
        const commonArea: ICommonArea = { id: 456 };
        const iDCommonAreaMedia: IMedia = { id: 33557 };
        commonArea.iDCommonAreaMedia = iDCommonAreaMedia;

        const iDCommonAreaMediaCollection: IMedia[] = [{ id: 56219 }];
        jest.spyOn(mediaService, 'query').mockReturnValue(of(new HttpResponse({ body: iDCommonAreaMediaCollection })));
        const expectedCollection: IMedia[] = [iDCommonAreaMedia, ...iDCommonAreaMediaCollection];
        jest.spyOn(mediaService, 'addMediaToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        expect(mediaService.query).toHaveBeenCalled();
        expect(mediaService.addMediaToCollectionIfMissing).toHaveBeenCalledWith(iDCommonAreaMediaCollection, iDCommonAreaMedia);
        expect(comp.iDCommonAreaMediasCollection).toEqual(expectedCollection);
      });

      it('Should call Condo query and add missing value', () => {
        const commonArea: ICommonArea = { id: 456 };
        const condo: ICondo = { id: 8815 };
        commonArea.condo = condo;

        const condoCollection: ICondo[] = [{ id: 75865 }];
        jest.spyOn(condoService, 'query').mockReturnValue(of(new HttpResponse({ body: condoCollection })));
        const additionalCondos = [condo];
        const expectedCollection: ICondo[] = [...additionalCondos, ...condoCollection];
        jest.spyOn(condoService, 'addCondoToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        expect(condoService.query).toHaveBeenCalled();
        expect(condoService.addCondoToCollectionIfMissing).toHaveBeenCalledWith(condoCollection, ...additionalCondos);
        expect(comp.condosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const commonArea: ICommonArea = { id: 456 };
        const iDCommonAreaMedia: IMedia = { id: 68859 };
        commonArea.iDCommonAreaMedia = iDCommonAreaMedia;
        const condo: ICondo = { id: 87911 };
        commonArea.condo = condo;

        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(commonArea));
        expect(comp.iDCommonAreaMediasCollection).toContain(iDCommonAreaMedia);
        expect(comp.condosSharedCollection).toContain(condo);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommonArea>>();
        const commonArea = { id: 123 };
        jest.spyOn(commonAreaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commonArea }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commonAreaService.update).toHaveBeenCalledWith(commonArea);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommonArea>>();
        const commonArea = new CommonArea();
        jest.spyOn(commonAreaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commonArea }));
        saveSubject.complete();

        // THEN
        expect(commonAreaService.create).toHaveBeenCalledWith(commonArea);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommonArea>>();
        const commonArea = { id: 123 };
        jest.spyOn(commonAreaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commonArea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commonAreaService.update).toHaveBeenCalledWith(commonArea);
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

      describe('trackCondoById', () => {
        it('Should return tracked Condo primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCondoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
