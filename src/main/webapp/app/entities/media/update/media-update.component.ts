import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMedia, Media } from '../media.model';
import { MediaService } from '../service/media.service';

@Component({
  selector: 'jhi-media-update',
  templateUrl: './media-update.component.html',
})
export class MediaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iDMedia: [null, [Validators.required]],
    url: [],
  });

  constructor(protected mediaService: MediaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ media }) => {
      this.updateForm(media);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const media = this.createFromForm();
    if (media.id !== undefined) {
      this.subscribeToSaveResponse(this.mediaService.update(media));
    } else {
      this.subscribeToSaveResponse(this.mediaService.create(media));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedia>>): void {
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

  protected updateForm(media: IMedia): void {
    this.editForm.patchValue({
      id: media.id,
      iDMedia: media.iDMedia,
      url: media.url,
    });
  }

  protected createFromForm(): IMedia {
    return {
      ...new Media(),
      id: this.editForm.get(['id'])!.value,
      iDMedia: this.editForm.get(['iDMedia'])!.value,
      url: this.editForm.get(['url'])!.value,
    };
  }
}
