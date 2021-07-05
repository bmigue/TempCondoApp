import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICheckLog } from '../check-log.model';

@Component({
  selector: 'jhi-check-log-detail',
  templateUrl: './check-log-detail.component.html',
})
export class CheckLogDetailComponent implements OnInit {
  checkLog: ICheckLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkLog }) => {
      this.checkLog = checkLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
