jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentService } from '../service/comment.service';
import { IComment, Comment } from '../comment.model';
import { IAdminWall } from 'app/entities/admin-wall/admin-wall.model';
import { AdminWallService } from 'app/entities/admin-wall/service/admin-wall.service';
import { IGeneralForum } from 'app/entities/general-forum/general-forum.model';
import { GeneralForumService } from 'app/entities/general-forum/service/general-forum.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Component Tests', () => {
  describe('Comment Management Update Component', () => {
    let comp: CommentUpdateComponent;
    let fixture: ComponentFixture<CommentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentService: CommentService;
    let adminWallService: AdminWallService;
    let generalForumService: GeneralForumService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentService = TestBed.inject(CommentService);
      adminWallService = TestBed.inject(AdminWallService);
      generalForumService = TestBed.inject(GeneralForumService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call AdminWall query and add missing value', () => {
        const comment: IComment = { id: 456 };
        const adminWall: IAdminWall = { id: 67232 };
        comment.adminWall = adminWall;

        const adminWallCollection: IAdminWall[] = [{ id: 36189 }];
        jest.spyOn(adminWallService, 'query').mockReturnValue(of(new HttpResponse({ body: adminWallCollection })));
        const additionalAdminWalls = [adminWall];
        const expectedCollection: IAdminWall[] = [...additionalAdminWalls, ...adminWallCollection];
        jest.spyOn(adminWallService, 'addAdminWallToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(adminWallService.query).toHaveBeenCalled();
        expect(adminWallService.addAdminWallToCollectionIfMissing).toHaveBeenCalledWith(adminWallCollection, ...additionalAdminWalls);
        expect(comp.adminWallsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call GeneralForum query and add missing value', () => {
        const comment: IComment = { id: 456 };
        const generalForum: IGeneralForum = { id: 6742 };
        comment.generalForum = generalForum;

        const generalForumCollection: IGeneralForum[] = [{ id: 63160 }];
        jest.spyOn(generalForumService, 'query').mockReturnValue(of(new HttpResponse({ body: generalForumCollection })));
        const additionalGeneralForums = [generalForum];
        const expectedCollection: IGeneralForum[] = [...additionalGeneralForums, ...generalForumCollection];
        jest.spyOn(generalForumService, 'addGeneralForumToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(generalForumService.query).toHaveBeenCalled();
        expect(generalForumService.addGeneralForumToCollectionIfMissing).toHaveBeenCalledWith(
          generalForumCollection,
          ...additionalGeneralForums
        );
        expect(comp.generalForumsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const comment: IComment = { id: 456 };
        const adminWall: IAdminWall = { id: 22497 };
        comment.adminWall = adminWall;
        const generalForum: IGeneralForum = { id: 34842 };
        comment.generalForum = generalForum;

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(comment));
        expect(comp.adminWallsSharedCollection).toContain(adminWall);
        expect(comp.generalForumsSharedCollection).toContain(generalForum);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentService.update).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = new Comment();
        jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(commentService.create).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentService.update).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAdminWallById', () => {
        it('Should return tracked AdminWall primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAdminWallById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackGeneralForumById', () => {
        it('Should return tracked GeneralForum primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackGeneralForumById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
