import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserInterface, UserInterface } from '../user-interface.model';
import { UserInterfaceService } from '../service/user-interface.service';

@Component({
  selector: 'jhi-user-interface-update',
  templateUrl: './user-interface-update.component.html',
})
export class UserInterfaceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iDUserInterface: [null, [Validators.required]],
    themeName: [],
    color: [],
  });

  constructor(protected userInterfaceService: UserInterfaceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInterface }) => {
      this.updateForm(userInterface);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userInterface = this.createFromForm();
    if (userInterface.id !== undefined) {
      this.subscribeToSaveResponse(this.userInterfaceService.update(userInterface));
    } else {
      this.subscribeToSaveResponse(this.userInterfaceService.create(userInterface));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInterface>>): void {
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

  protected updateForm(userInterface: IUserInterface): void {
    this.editForm.patchValue({
      id: userInterface.id,
      iDUserInterface: userInterface.iDUserInterface,
      themeName: userInterface.themeName,
      color: userInterface.color,
    });
  }

  protected createFromForm(): IUserInterface {
    return {
      ...new UserInterface(),
      id: this.editForm.get(['id'])!.value,
      iDUserInterface: this.editForm.get(['iDUserInterface'])!.value,
      themeName: this.editForm.get(['themeName'])!.value,
      color: this.editForm.get(['color'])!.value,
    };
  }
}
