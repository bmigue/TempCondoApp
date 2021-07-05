import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISchedule, Schedule } from '../schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-schedule-update',
  templateUrl: './schedule-update.component.html',
})
export class ScheduleUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDSchedule: [null, [Validators.required]],
    inDateTime: [],
    outDateTime: [],
    userProfile: [],
  });

  constructor(
    protected scheduleService: ScheduleService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedule }) => {
      if (schedule.id === undefined) {
        const today = dayjs().startOf('day');
        schedule.inDateTime = today;
        schedule.outDateTime = today;
      }

      this.updateForm(schedule);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const schedule = this.createFromForm();
    if (schedule.id !== undefined) {
      this.subscribeToSaveResponse(this.scheduleService.update(schedule));
    } else {
      this.subscribeToSaveResponse(this.scheduleService.create(schedule));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchedule>>): void {
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

  protected updateForm(schedule: ISchedule): void {
    this.editForm.patchValue({
      id: schedule.id,
      iDSchedule: schedule.iDSchedule,
      inDateTime: schedule.inDateTime ? schedule.inDateTime.format(DATE_TIME_FORMAT) : null,
      outDateTime: schedule.outDateTime ? schedule.outDateTime.format(DATE_TIME_FORMAT) : null,
      userProfile: schedule.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      schedule.userProfile
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

  protected createFromForm(): ISchedule {
    return {
      ...new Schedule(),
      id: this.editForm.get(['id'])!.value,
      iDSchedule: this.editForm.get(['iDSchedule'])!.value,
      inDateTime: this.editForm.get(['inDateTime'])!.value ? dayjs(this.editForm.get(['inDateTime'])!.value, DATE_TIME_FORMAT) : undefined,
      outDateTime: this.editForm.get(['outDateTime'])!.value
        ? dayjs(this.editForm.get(['outDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
