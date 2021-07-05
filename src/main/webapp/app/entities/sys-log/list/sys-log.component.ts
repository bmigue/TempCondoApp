import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISysLog } from '../sys-log.model';
import { SysLogService } from '../service/sys-log.service';
import { SysLogDeleteDialogComponent } from '../delete/sys-log-delete-dialog.component';

@Component({
  selector: 'jhi-sys-log',
  templateUrl: './sys-log.component.html',
})
export class SysLogComponent implements OnInit {
  sysLogs?: ISysLog[];
  isLoading = false;

  constructor(protected sysLogService: SysLogService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sysLogService.query().subscribe(
      (res: HttpResponse<ISysLog[]>) => {
        this.isLoading = false;
        this.sysLogs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISysLog): number {
    return item.id!;
  }

  delete(sysLog: ISysLog): void {
    const modalRef = this.modalService.open(SysLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sysLog = sysLog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
