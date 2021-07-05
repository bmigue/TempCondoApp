import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommonArea, CommonArea } from '../common-area.model';
import { CommonAreaService } from '../service/common-area.service';
import { IMedia } from 'app/entities/media/media.model';
import { MediaService } from 'app/entities/media/service/media.service';
import { ICondo } from 'app/entities/condo/condo.model';
import { CondoService } from 'app/entities/condo/service/condo.service';

@Component({
  selector: 'jhi-common-area-update',
  templateUrl: './common-area-update.component.html',
})
export class CommonAreaUpdateComponent implements OnInit {
  isSaving = false;

  iDCommonAreaMediasCollection: IMedia[] = [];
  condosSharedCollection: ICondo[] = [];

  editForm = this.fb.group({
    id: [],
    iDCommonArea: [null, [Validators.required]],
    status: [],
    name: [],
    iDCommonAreaMedia: [],
    condo: [],
  });

  constructor(
    protected commonAreaService: CommonAreaService,
    protected mediaService: MediaService,
    protected condoService: CondoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commonArea }) => {
      this.updateForm(commonArea);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commonArea = this.createFromForm();
    if (commonArea.id !== undefined) {
      this.subscribeToSaveResponse(this.commonAreaService.update(commonArea));
    } else {
      this.subscribeToSaveResponse(this.commonAreaService.create(commonArea));
    }
  }

  trackMediaById(index: number, item: IMedia): number {
    return item.id!;
  }

  trackCondoById(index: number, item: ICondo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommonArea>>): void {
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

  protected updateForm(commonArea: ICommonArea): void {
    this.editForm.patchValue({
      id: commonArea.id,
      iDCommonArea: commonArea.iDCommonArea,
      status: commonArea.status,
      name: commonArea.name,
      iDCommonAreaMedia: commonArea.iDCommonAreaMedia,
      condo: commonArea.condo,
    });

    this.iDCommonAreaMediasCollection = this.mediaService.addMediaToCollectionIfMissing(
      this.iDCommonAreaMediasCollection,
      commonArea.iDCommonAreaMedia
    );
    this.condosSharedCollection = this.condoService.addCondoToCollectionIfMissing(this.condosSharedCollection, commonArea.condo);
  }

  protected loadRelationshipsOptions(): void {
    this.mediaService
      .query({ filter: 'commonarea-is-null' })
      .pipe(map((res: HttpResponse<IMedia[]>) => res.body ?? []))
      .pipe(map((media: IMedia[]) => this.mediaService.addMediaToCollectionIfMissing(media, this.editForm.get('iDCommonAreaMedia')!.value)))
      .subscribe((media: IMedia[]) => (this.iDCommonAreaMediasCollection = media));

    this.condoService
      .query()
      .pipe(map((res: HttpResponse<ICondo[]>) => res.body ?? []))
      .pipe(map((condos: ICondo[]) => this.condoService.addCondoToCollectionIfMissing(condos, this.editForm.get('condo')!.value)))
      .subscribe((condos: ICondo[]) => (this.condosSharedCollection = condos));
  }

  protected createFromForm(): ICommonArea {
    return {
      ...new CommonArea(),
      id: this.editForm.get(['id'])!.value,
      iDCommonArea: this.editForm.get(['iDCommonArea'])!.value,
      status: this.editForm.get(['status'])!.value,
      name: this.editForm.get(['name'])!.value,
      iDCommonAreaMedia: this.editForm.get(['iDCommonAreaMedia'])!.value,
      condo: this.editForm.get(['condo'])!.value,
    };
  }
}
