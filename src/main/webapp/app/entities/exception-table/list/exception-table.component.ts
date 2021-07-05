import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExceptionTable } from '../exception-table.model';
import { ExceptionTableService } from '../service/exception-table.service';
import { ExceptionTableDeleteDialogComponent } from '../delete/exception-table-delete-dialog.component';

@Component({
  selector: 'jhi-exception-table',
  templateUrl: './exception-table.component.html',
})
export class ExceptionTableComponent implements OnInit {
  exceptionTables?: IExceptionTable[];
  isLoading = false;

  constructor(protected exceptionTableService: ExceptionTableService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.exceptionTableService.query().subscribe(
      (res: HttpResponse<IExceptionTable[]>) => {
        this.isLoading = false;
        this.exceptionTables = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IExceptionTable): number {
    return item.id!;
  }

  delete(exceptionTable: IExceptionTable): void {
    const modalRef = this.modalService.open(ExceptionTableDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.exceptionTable = exceptionTable;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
