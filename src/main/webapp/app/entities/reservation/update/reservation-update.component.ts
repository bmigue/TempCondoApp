import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReservation, Reservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { ICommonArea } from 'app/entities/common-area/common-area.model';
import { CommonAreaService } from 'app/entities/common-area/service/common-area.service';

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];
  commonAreasSharedCollection: ICommonArea[] = [];

  editForm = this.fb.group({
    id: [],
    iDReservation: [null, [Validators.required]],
    resDateTime: [],
    status: [],
    userProfile: [],
    commonArea: [],
  });

  constructor(
    protected reservationService: ReservationService,
    protected userProfileService: UserProfileService,
    protected commonAreaService: CommonAreaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      if (reservation.id === undefined) {
        const today = dayjs().startOf('day');
        reservation.resDateTime = today;
      }

      this.updateForm(reservation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservation = this.createFromForm();
    if (reservation.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  trackCommonAreaById(index: number, item: ICommonArea): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
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

  protected updateForm(reservation: IReservation): void {
    this.editForm.patchValue({
      id: reservation.id,
      iDReservation: reservation.iDReservation,
      resDateTime: reservation.resDateTime ? reservation.resDateTime.format(DATE_TIME_FORMAT) : null,
      status: reservation.status,
      userProfile: reservation.userProfile,
      commonArea: reservation.commonArea,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      reservation.userProfile
    );
    this.commonAreasSharedCollection = this.commonAreaService.addCommonAreaToCollectionIfMissing(
      this.commonAreasSharedCollection,
      reservation.commonArea
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

    this.commonAreaService
      .query()
      .pipe(map((res: HttpResponse<ICommonArea[]>) => res.body ?? []))
      .pipe(
        map((commonAreas: ICommonArea[]) =>
          this.commonAreaService.addCommonAreaToCollectionIfMissing(commonAreas, this.editForm.get('commonArea')!.value)
        )
      )
      .subscribe((commonAreas: ICommonArea[]) => (this.commonAreasSharedCollection = commonAreas));
  }

  protected createFromForm(): IReservation {
    return {
      ...new Reservation(),
      id: this.editForm.get(['id'])!.value,
      iDReservation: this.editForm.get(['iDReservation'])!.value,
      resDateTime: this.editForm.get(['resDateTime'])!.value
        ? dayjs(this.editForm.get(['resDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
      commonArea: this.editForm.get(['commonArea'])!.value,
    };
  }
}
