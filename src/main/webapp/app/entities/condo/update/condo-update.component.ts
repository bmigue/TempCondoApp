import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICondo, Condo } from '../condo.model';
import { CondoService } from '../service/condo.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-condo-update',
  templateUrl: './condo-update.component.html',
})
export class CondoUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDCondo: [null, [Validators.required]],
    nombre: [],
    userProfile: [],
  });

  constructor(
    protected condoService: CondoService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ condo }) => {
      this.updateForm(condo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const condo = this.createFromForm();
    if (condo.id !== undefined) {
      this.subscribeToSaveResponse(this.condoService.update(condo));
    } else {
      this.subscribeToSaveResponse(this.condoService.create(condo));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICondo>>): void {
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

  protected updateForm(condo: ICondo): void {
    this.editForm.patchValue({
      id: condo.id,
      iDCondo: condo.iDCondo,
      nombre: condo.nombre,
      userProfile: condo.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      condo.userProfile
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

  protected createFromForm(): ICondo {
    return {
      ...new Condo(),
      id: this.editForm.get(['id'])!.value,
      iDCondo: this.editForm.get(['iDCondo'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
