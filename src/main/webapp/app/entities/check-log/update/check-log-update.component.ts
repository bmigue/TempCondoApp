import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICheckLog, CheckLog } from '../check-log.model';
import { CheckLogService } from '../service/check-log.service';
import { IGuest } from 'app/entities/guest/guest.model';
import { GuestService } from 'app/entities/guest/service/guest.service';

@Component({
  selector: 'jhi-check-log-update',
  templateUrl: './check-log-update.component.html',
})
export class CheckLogUpdateComponent implements OnInit {
  isSaving = false;

  guestsSharedCollection: IGuest[] = [];

  editForm = this.fb.group({
    id: [],
    iDCheckLog: [null, [Validators.required]],
    inDateTime: [],
    outDateTime: [],
    iDCheckLogGuests: [],
  });

  constructor(
    protected checkLogService: CheckLogService,
    protected guestService: GuestService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkLog }) => {
      if (checkLog.id === undefined) {
        const today = dayjs().startOf('day');
        checkLog.inDateTime = today;
        checkLog.outDateTime = today;
      }

      this.updateForm(checkLog);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkLog = this.createFromForm();
    if (checkLog.id !== undefined) {
      this.subscribeToSaveResponse(this.checkLogService.update(checkLog));
    } else {
      this.subscribeToSaveResponse(this.checkLogService.create(checkLog));
    }
  }

  trackGuestById(index: number, item: IGuest): number {
    return item.id!;
  }

  getSelectedGuest(option: IGuest, selectedVals?: IGuest[]): IGuest {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckLog>>): void {
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

  protected updateForm(checkLog: ICheckLog): void {
    this.editForm.patchValue({
      id: checkLog.id,
      iDCheckLog: checkLog.iDCheckLog,
      inDateTime: checkLog.inDateTime ? checkLog.inDateTime.format(DATE_TIME_FORMAT) : null,
      outDateTime: checkLog.outDateTime ? checkLog.outDateTime.format(DATE_TIME_FORMAT) : null,
      iDCheckLogGuests: checkLog.iDCheckLogGuests,
    });

    this.guestsSharedCollection = this.guestService.addGuestToCollectionIfMissing(
      this.guestsSharedCollection,
      ...(checkLog.iDCheckLogGuests ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.guestService
      .query()
      .pipe(map((res: HttpResponse<IGuest[]>) => res.body ?? []))
      .pipe(
        map((guests: IGuest[]) =>
          this.guestService.addGuestToCollectionIfMissing(guests, ...(this.editForm.get('iDCheckLogGuests')!.value ?? []))
        )
      )
      .subscribe((guests: IGuest[]) => (this.guestsSharedCollection = guests));
  }

  protected createFromForm(): ICheckLog {
    return {
      ...new CheckLog(),
      id: this.editForm.get(['id'])!.value,
      iDCheckLog: this.editForm.get(['iDCheckLog'])!.value,
      inDateTime: this.editForm.get(['inDateTime'])!.value ? dayjs(this.editForm.get(['inDateTime'])!.value, DATE_TIME_FORMAT) : undefined,
      outDateTime: this.editForm.get(['outDateTime'])!.value
        ? dayjs(this.editForm.get(['outDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      iDCheckLogGuests: this.editForm.get(['iDCheckLogGuests'])!.value,
    };
  }
}
