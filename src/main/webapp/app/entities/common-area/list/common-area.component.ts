import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommonArea } from '../common-area.model';
import { CommonAreaService } from '../service/common-area.service';
import { CommonAreaDeleteDialogComponent } from '../delete/common-area-delete-dialog.component';

@Component({
  selector: 'jhi-common-area',
  templateUrl: './common-area.component.html',
})
export class CommonAreaComponent implements OnInit {
  commonAreas?: ICommonArea[];
  isLoading = false;

  constructor(protected commonAreaService: CommonAreaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.commonAreaService.query().subscribe(
      (res: HttpResponse<ICommonArea[]>) => {
        this.isLoading = false;
        this.commonAreas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICommonArea): number {
    return item.id!;
  }

  delete(commonArea: ICommonArea): void {
    const modalRef = this.modalService.open(CommonAreaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commonArea = commonArea;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
