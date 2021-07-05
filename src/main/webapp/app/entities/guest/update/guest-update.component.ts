import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGuest, Guest } from '../guest.model';
import { GuestService } from '../service/guest.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-guest-update',
  templateUrl: './guest-update.component.html',
})
export class GuestUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDGuest: [null, [Validators.required]],
    fullName: [],
    plateNumber: [],
    status: [],
    userProfile: [],
  });

  constructor(
    protected guestService: GuestService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guest }) => {
      this.updateForm(guest);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const guest = this.createFromForm();
    if (guest.id !== undefined) {
      this.subscribeToSaveResponse(this.guestService.update(guest));
    } else {
      this.subscribeToSaveResponse(this.guestService.create(guest));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGuest>>): void {
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

  protected updateForm(guest: IGuest): void {
    this.editForm.patchValue({
      id: guest.id,
      iDGuest: guest.iDGuest,
      fullName: guest.fullName,
      plateNumber: guest.plateNumber,
      status: guest.status,
      userProfile: guest.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      guest.userProfile
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

  protected createFromForm(): IGuest {
    return {
      ...new Guest(),
      id: this.editForm.get(['id'])!.value,
      iDGuest: this.editForm.get(['iDGuest'])!.value,
      fullName: this.editForm.get(['fullName'])!.value,
      plateNumber: this.editForm.get(['plateNumber'])!.value,
      status: this.editForm.get(['status'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
