import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExceptionTable } from '../exception-table.model';

@Component({
  selector: 'jhi-exception-table-detail',
  templateUrl: './exception-table-detail.component.html',
})
export class ExceptionTableDetailComponent implements OnInit {
  exceptionTable: IExceptionTable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exceptionTable }) => {
      this.exceptionTable = exceptionTable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
