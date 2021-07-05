import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAdminWall, AdminWall } from '../admin-wall.model';
import { AdminWallService } from '../service/admin-wall.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-admin-wall-update',
  templateUrl: './admin-wall-update.component.html',
})
export class AdminWallUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDAdminWall: [null, [Validators.required]],
    postDate: [],
    post: [],
    userProfile: [],
  });

  constructor(
    protected adminWallService: AdminWallService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adminWall }) => {
      if (adminWall.id === undefined) {
        const today = dayjs().startOf('day');
        adminWall.postDate = today;
      }

      this.updateForm(adminWall);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adminWall = this.createFromForm();
    if (adminWall.id !== undefined) {
      this.subscribeToSaveResponse(this.adminWallService.update(adminWall));
    } else {
      this.subscribeToSaveResponse(this.adminWallService.create(adminWall));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdminWall>>): void {
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

  protected updateForm(adminWall: IAdminWall): void {
    this.editForm.patchValue({
      id: adminWall.id,
      iDAdminWall: adminWall.iDAdminWall,
      postDate: adminWall.postDate ? adminWall.postDate.format(DATE_TIME_FORMAT) : null,
      post: adminWall.post,
      userProfile: adminWall.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      adminWall.userProfile
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

  protected createFromForm(): IAdminWall {
    return {
      ...new AdminWall(),
      id: this.editForm.get(['id'])!.value,
      iDAdminWall: this.editForm.get(['iDAdminWall'])!.value,
      postDate: this.editForm.get(['postDate'])!.value ? dayjs(this.editForm.get(['postDate'])!.value, DATE_TIME_FORMAT) : undefined,
      post: this.editForm.get(['post'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
