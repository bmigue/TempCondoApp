jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MediaService } from '../service/media.service';
import { IMedia, Media } from '../media.model';

import { MediaUpdateComponent } from './media-update.component';

describe('Component Tests', () => {
  describe('Media Management Update Component', () => {
    let comp: MediaUpdateComponent;
    let fixture: ComponentFixture<MediaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mediaService: MediaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MediaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MediaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MediaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mediaService = TestBed.inject(MediaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const media: IMedia = { id: 456 };

        activatedRoute.data = of({ media });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(media));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Media>>();
        const media = { id: 123 };
        jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ media });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: media }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mediaService.update).toHaveBeenCalledWith(media);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Media>>();
        const media = new Media();
        jest.spyOn(mediaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ media });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: media }));
        saveSubject.complete();

        // THEN
        expect(mediaService.create).toHaveBeenCalledWith(media);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Media>>();
        const media = { id: 123 };
        jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ media });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mediaService.update).toHaveBeenCalledWith(media);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
