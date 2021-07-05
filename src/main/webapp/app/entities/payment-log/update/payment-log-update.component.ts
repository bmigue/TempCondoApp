import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentLog, PaymentLog } from '../payment-log.model';
import { PaymentLogService } from '../service/payment-log.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-payment-log-update',
  templateUrl: './payment-log-update.component.html',
})
export class PaymentLogUpdateComponent implements OnInit {
  isSaving = false;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm = this.fb.group({
    id: [],
    iDPaymentLog: [null, [Validators.required]],
    dueDate: [],
    status: [],
    userProfile: [],
  });

  constructor(
    protected paymentLogService: PaymentLogService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentLog }) => {
      this.updateForm(paymentLog);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentLog = this.createFromForm();
    if (paymentLog.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentLogService.update(paymentLog));
    } else {
      this.subscribeToSaveResponse(this.paymentLogService.create(paymentLog));
    }
  }

  trackUserProfileById(index: number, item: IUserProfile): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentLog>>): void {
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

  protected updateForm(paymentLog: IPaymentLog): void {
    this.editForm.patchValue({
      id: paymentLog.id,
      iDPaymentLog: paymentLog.iDPaymentLog,
      dueDate: paymentLog.dueDate,
      status: paymentLog.status,
      userProfile: paymentLog.userProfile,
    });

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing(
      this.userProfilesSharedCollection,
      paymentLog.userProfile
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

  protected createFromForm(): IPaymentLog {
    return {
      ...new PaymentLog(),
      id: this.editForm.get(['id'])!.value,
      iDPaymentLog: this.editForm.get(['iDPaymentLog'])!.value,
      dueDate: this.editForm.get(['dueDate'])!.value,
      status: this.editForm.get(['status'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }
}
