import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICondo } from '../condo.model';
import { CondoService } from '../service/condo.service';
import { CondoDeleteDialogComponent } from '../delete/condo-delete-dialog.component';

@Component({
  selector: 'jhi-condo',
  templateUrl: './condo.component.html',
})
export class CondoComponent implements OnInit {
  condos?: ICondo[];
  isLoading = false;

  constructor(protected condoService: CondoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.condoService.query().subscribe(
      (res: HttpResponse<ICondo[]>) => {
        this.isLoading = false;
        this.condos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICondo): number {
    return item.id!;
  }

  delete(condo: ICondo): void {
    const modalRef = this.modalService.open(CondoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.condo = condo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
