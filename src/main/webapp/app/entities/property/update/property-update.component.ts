import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProperty, Property } from '../property.model';
import { PropertyService } from '../service/property.service';
import { IMedia } from 'app/entities/media/media.model';
import { MediaService } from 'app/entities/media/service/media.service';

@Component({
  selector: 'jhi-property-update',
  templateUrl: './property-update.component.html',
})
export class PropertyUpdateComponent implements OnInit {
  isSaving = false;

  iDPropertyMediasCollection: IMedia[] = [];

  editForm = this.fb.group({
    id: [],
    iDProperty: [null, [Validators.required]],
    type: [],
    description: [],
    hasHouseBuilt: [],
    propertySize: [],
    iDPropertyMedia: [],
  });

  constructor(
    protected propertyService: PropertyService,
    protected mediaService: MediaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ property }) => {
      this.updateForm(property);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const property = this.createFromForm();
    if (property.id !== undefined) {
      this.subscribeToSaveResponse(this.propertyService.update(property));
    } else {
      this.subscribeToSaveResponse(this.propertyService.create(property));
    }
  }

  trackMediaById(index: number, item: IMedia): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProperty>>): void {
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

  protected updateForm(property: IProperty): void {
    this.editForm.patchValue({
      id: property.id,
      iDProperty: property.iDProperty,
      type: property.type,
      description: property.description,
      hasHouseBuilt: property.hasHouseBuilt,
      propertySize: property.propertySize,
      iDPropertyMedia: property.iDPropertyMedia,
    });

    this.iDPropertyMediasCollection = this.mediaService.addMediaToCollectionIfMissing(
      this.iDPropertyMediasCollection,
      property.iDPropertyMedia
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mediaService
      .query({ filter: 'property-is-null' })
      .pipe(map((res: HttpResponse<IMedia[]>) => res.body ?? []))
      .pipe(map((media: IMedia[]) => this.mediaService.addMediaToCollectionIfMissing(media, this.editForm.get('iDPropertyMedia')!.value)))
      .subscribe((media: IMedia[]) => (this.iDPropertyMediasCollection = media));
  }

  protected createFromForm(): IProperty {
    return {
      ...new Property(),
      id: this.editForm.get(['id'])!.value,
      iDProperty: this.editForm.get(['iDProperty'])!.value,
      type: this.editForm.get(['type'])!.value,
      description: this.editForm.get(['description'])!.value,
      hasHouseBuilt: this.editForm.get(['hasHouseBuilt'])!.value,
      propertySize: this.editForm.get(['propertySize'])!.value,
      iDPropertyMedia: this.editForm.get(['iDPropertyMedia'])!.value,
    };
  }
}
