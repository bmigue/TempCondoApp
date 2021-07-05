import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserProfile, UserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { IUserInterface } from 'app/entities/user-interface/user-interface.model';
import { UserInterfaceService } from 'app/entities/user-interface/service/user-interface.service';

@Component({
  selector: 'jhi-user-profile-update',
  templateUrl: './user-profile-update.component.html',
})
export class UserProfileUpdateComponent implements OnInit {
  isSaving = false;

  idUserUserInterfacesCollection: IUserInterface[] = [];

  editForm = this.fb.group({
    id: [],
    iDUser: [null, [Validators.required]],
    name: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    plateNumber: [],
    status: [],
    type: [],
    idUserUserInterface: [],
  });

  constructor(
    protected userProfileService: UserProfileService,
    protected userInterfaceService: UserInterfaceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.updateForm(userProfile);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userProfile = this.createFromForm();
    if (userProfile.id !== undefined) {
      this.subscribeToSaveResponse(this.userProfileService.update(userProfile));
    } else {
      this.subscribeToSaveResponse(this.userProfileService.create(userProfile));
    }
  }

  trackUserInterfaceById(index: number, item: IUserInterface): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserProfile>>): void {
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

  protected updateForm(userProfile: IUserProfile): void {
    this.editForm.patchValue({
      id: userProfile.id,
      iDUser: userProfile.iDUser,
      name: userProfile.name,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phoneNumber: userProfile.phoneNumber,
      plateNumber: userProfile.plateNumber,
      status: userProfile.status,
      type: userProfile.type,
      idUserUserInterface: userProfile.idUserUserInterface,
    });

    this.idUserUserInterfacesCollection = this.userInterfaceService.addUserInterfaceToCollectionIfMissing(
      this.idUserUserInterfacesCollection,
      userProfile.idUserUserInterface
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userInterfaceService
      .query({ filter: 'userprofile-is-null' })
      .pipe(map((res: HttpResponse<IUserInterface[]>) => res.body ?? []))
      .pipe(
        map((userInterfaces: IUserInterface[]) =>
          this.userInterfaceService.addUserInterfaceToCollectionIfMissing(userInterfaces, this.editForm.get('idUserUserInterface')!.value)
        )
      )
      .subscribe((userInterfaces: IUserInterface[]) => (this.idUserUserInterfacesCollection = userInterfaces));
  }

  protected createFromForm(): IUserProfile {
    return {
      ...new UserProfile(),
      id: this.editForm.get(['id'])!.value,
      iDUser: this.editForm.get(['iDUser'])!.value,
      name: this.editForm.get(['name'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      plateNumber: this.editForm.get(['plateNumber'])!.value,
      status: this.editForm.get(['status'])!.value,
      type: this.editForm.get(['type'])!.value,
      idUserUserInterface: this.editForm.get(['idUserUserInterface'])!.value,
    };
  }
}
