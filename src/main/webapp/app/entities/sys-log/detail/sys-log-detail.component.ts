import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISysLog } from '../sys-log.model';

@Component({
  selector: 'jhi-sys-log-detail',
  templateUrl: './sys-log-detail.component.html',
})
export class SysLogDetailComponent implements OnInit {
  sysLog: ISysLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sysLog }) => {
      this.sysLog = sysLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
