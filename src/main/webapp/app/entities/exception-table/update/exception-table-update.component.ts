import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IExceptionTable, ExceptionTable } from '../exception-table.model';
import { ExceptionTableService } from '../service/exception-table.service';

@Component({
  selector: 'jhi-exception-table-update',
  templateUrl: './exception-table-update.component.html',
})
export class ExceptionTableUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iDException: [null, [Validators.required]],
    message: [],
    number: [],
  });

  constructor(
    protected exceptionTableService: ExceptionTableService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exceptionTable }) => {
      this.updateForm(exceptionTable);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exceptionTable = this.createFromForm();
    if (exceptionTable.id !== undefined) {
      this.subscribeToSaveResponse(this.exceptionTableService.update(exceptionTable));
    } else {
      this.subscribeToSaveResponse(this.exceptionTableService.create(exceptionTable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExceptionTable>>): void {
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

  protected updateForm(exceptionTable: IExceptionTable): void {
    this.editForm.patchValue({
      id: exceptionTable.id,
      iDException: exceptionTable.iDException,
      message: exceptionTable.message,
      number: exceptionTable.number,
    });
  }

  protected createFromForm(): IExceptionTable {
    return {
      ...new ExceptionTable(),
      id: this.editForm.get(['id'])!.value,
      iDException: this.editForm.get(['iDException'])!.value,
      message: this.editForm.get(['message'])!.value,
      number: this.editForm.get(['number'])!.value,
    };
  }
}
