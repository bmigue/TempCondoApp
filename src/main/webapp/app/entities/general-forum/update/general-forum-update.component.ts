import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IGeneralForum, GeneralForum } from '../general-forum.model';
import { GeneralForumService } from '../service/general-forum.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-general-forum-update',
  templateUrl: './general-forum-update.component.html',
})
export class GeneralForumUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDGeneralForum: [null, [Validators.required]],
    postDate: [],
    post: [],
    userProfile: [],
  });

  constructor(
    protected generalForumService: GeneralForumService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ generalForum }) => {
      if (generalForum.id === undefined) {
        const today = dayjs().startOf('day');
        generalForum.postDate = today;
      }

      this.updateForm(generalForum);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const generalForum = this.createFromForm();
    if (generalForum.id !== undefined) {
      this.subscribeToSaveResponse(this.generalForumService.update(generalForum));
    } else {
      this.subscribeToSaveResponse(this.generalForumService.create(generalForum));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGeneralForum>>): void {
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

  protected updateForm(generalForum: IGeneralForum): void {
    this.editForm.patchValue({
      id: generalForum.id,
      iDGeneralForum: generalForum.iDGeneralForum,
      postDate: generalForum.postDate ? generalForum.postDate.format(DATE_TIME_FORMAT) : null,
      post: generalForum.post,
      userProfile: generalForum.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      generalForum.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing(userProfiles, this.editForm.get('userProfile')!.value)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }

  protected createFromForm(): IGeneralForum {
    return {
      ...new GeneralForum(),
      id: this.editForm.get(['id'])!.value,
      iDGeneralForum: this.editForm.get(['iDGeneralForum'])!.value,
      postDate: this.editForm.get(['postDate'])!.value ? dayjs(this.editForm.get(['postDate'])!.value, DATE_TIME_FORMAT) : undefined,
      post: this.editForm.get(['post'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
