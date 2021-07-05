import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IComment, Comment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { IAdminWall } from 'app/entities/admin-wall/admin-wall.model';
import { AdminWallService } from 'app/entities/admin-wall/service/admin-wall.service';
import { IGeneralForum } from 'app/entities/general-forum/general-forum.model';
import { GeneralForumService } from 'app/entities/general-forum/service/general-forum.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;

  adminWallsSharedCollection: IAdminWall[] = [];
  generalForumsSharedCollection: IGeneralForum[] = [];

  editForm = this.fb.group({
    id: [],
    iDComment: [null, [Validators.required]],
    postDate: [],
    comment: [],
    adminWall: [],
    generalForum: [],
  });

  constructor(
    protected commentService: CommentService,
    protected adminWallService: AdminWallService,
    protected generalForumService: GeneralForumService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      if (comment.id === undefined) {
        const today = dayjs().startOf('day');
        comment.postDate = today;
      }

      this.updateForm(comment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  trackAdminWallById(index: number, item: IAdminWall): number {
    return item.id!;
  }

  trackGeneralForumById(index: number, item: IGeneralForum): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(comment: IComment): void {
    this.editForm.patchValue({
      id: comment.id,
      iDComment: comment.iDComment,
      postDate: comment.postDate ? comment.postDate.format(DATE_TIME_FORMAT) : null,
      comment: comment.comment,
      adminWall: comment.adminWall,
      generalForum: comment.generalForum,
    });

    this.adminWallsSharedCollection = this.adminWallService.addAdminWallToCollectionIfMissing(
      this.adminWallsSharedCollection,
      comment.adminWall
    );
    this.generalForumsSharedCollection = this.generalForumService.addGeneralForumToCollectionIfMissing(
      this.generalForumsSharedCollection,
      comment.generalForum
    );
  }

  protected loadRelationshipsOptions(): void {
    this.adminWallService
      .query()
      .pipe(map((res: HttpResponse<IAdminWall[]>) => res.body ?? []))
      .pipe(
        map((adminWalls: IAdminWall[]) =>
          this.adminWallService.addAdminWallToCollectionIfMissing(adminWalls, this.editForm.get('adminWall')!.value)
        )
      )
      .subscribe((adminWalls: IAdminWall[]) => (this.adminWallsSharedCollection = adminWalls));

    this.generalForumService
      .query()
      .pipe(map((res: HttpResponse<IGeneralForum[]>) => res.body ?? []))
      .pipe(
        map((generalForums: IGeneralForum[]) =>
          this.generalForumService.addGeneralForumToCollectionIfMissing(generalForums, this.editForm.get('generalForum')!.value)
        )
      )
      .subscribe((generalForums: IGeneralForum[]) => (this.generalForumsSharedCollection = generalForums));
  }

  protected createFromForm(): IComment {
    return {
      ...new Comment(),
      id: this.editForm.get(['id'])!.value,
      iDComment: this.editForm.get(['iDComment'])!.value,
      postDate: this.editForm.get(['postDate'])!.value ? dayjs(this.editForm.get(['postDate'])!.value, DATE_TIME_FORMAT) : undefined,
      comment: this.editForm.get(['comment'])!.value,
      adminWall: this.editForm.get(['adminWall'])!.value,
      generalForum: this.editForm.get(['generalForum'])!.value,
    };
  }
}
