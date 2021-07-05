import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProperty } from '../property.model';
import { PropertyService } from '../service/property.service';
import { PropertyDeleteDialogComponent } from '../delete/property-delete-dialog.component';

@Component({
  selector: 'jhi-property',
  templateUrl: './property.component.html',
})
export class PropertyComponent implements OnInit {
  properties?: IProperty[];
  isLoading = false;

  constructor(protected propertyService: PropertyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.propertyService.query().subscribe(
      (res: HttpResponse<IProperty[]>) => {
        this.isLoading = false;
        this.properties = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProperty): number {
    return item.id!;
  }

  delete(property: IProperty): void {
    const modalRef = this.modalService.open(PropertyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.property = property;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
