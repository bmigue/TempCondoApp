import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISysLog, SysLog } from '../sys-log.model';
import { SysLogService } from '../service/sys-log.service';

@Component({
  selector: 'jhi-sys-log-update',
  templateUrl: './sys-log-update.component.html',
})
export class SysLogUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iDSysLog: [null, [Validators.required]],
    logDateTime: [],
    action: [],
  });

  constructor(protected sysLogService: SysLogService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sysLog }) => {
      if (sysLog.id === undefined) {
        const today = dayjs().startOf('day');
        sysLog.logDateTime = today;
      }

      this.updateForm(sysLog);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sysLog = this.createFromForm();
    if (sysLog.id !== undefined) {
      this.subscribeToSaveResponse(this.sysLogService.update(sysLog));
    } else {
      this.subscribeToSaveResponse(this.sysLogService.create(sysLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISysLog>>): void {
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

  protected updateForm(sysLog: ISysLog): void {
    this.editForm.patchValue({
      id: sysLog.id,
      iDSysLog: sysLog.iDSysLog,
      logDateTime: sysLog.logDateTime ? sysLog.logDateTime.format(DATE_TIME_FORMAT) : null,
      action: sysLog.action,
    });
  }

  protected createFromForm(): ISysLog {
    return {
      ...new SysLog(),
      id: this.editForm.get(['id'])!.value,
      iDSysLog: this.editForm.get(['iDSysLog'])!.value,
      logDateTime: this.editForm.get(['logDateTime'])!.value
        ? dayjs(this.editForm.get(['logDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      action: this.editForm.get(['action'])!.value,
    };
  }
}
