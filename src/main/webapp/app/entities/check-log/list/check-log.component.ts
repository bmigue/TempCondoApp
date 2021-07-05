import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICheckLog } from '../check-log.model';
import { CheckLogService } from '../service/check-log.service';
import { CheckLogDeleteDialogComponent } from '../delete/check-log-delete-dialog.component';

@Component({
  selector: 'jhi-check-log',
  templateUrl: './check-log.component.html',
})
export class CheckLogComponent implements OnInit {
  checkLogs?: ICheckLog[];
  isLoading = false;

  constructor(protected checkLogService: CheckLogService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.checkLogService.query().subscribe(
      (res: HttpResponse<ICheckLog[]>) => {
        this.isLoading = false;
        this.checkLogs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICheckLog): number {
    return item.id!;
  }

  delete(checkLog: ICheckLog): void {
    const modalRef = this.modalService.open(CheckLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.checkLog = checkLog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
