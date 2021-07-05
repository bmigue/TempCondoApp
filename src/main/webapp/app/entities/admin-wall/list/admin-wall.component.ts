import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdminWall } from '../admin-wall.model';
import { AdminWallService } from '../service/admin-wall.service';
import { AdminWallDeleteDialogComponent } from '../delete/admin-wall-delete-dialog.component';

@Component({
  selector: 'jhi-admin-wall',
  templateUrl: './admin-wall.component.html',
})
export class AdminWallComponent implements OnInit {
  adminWalls?: IAdminWall[];
  isLoading = false;

  constructor(protected adminWallService: AdminWallService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.adminWallService.query().subscribe(
      (res: HttpResponse<IAdminWall[]>) => {
        this.isLoading = false;
        this.adminWalls = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAdminWall): number {
    return item.id!;
  }

  delete(adminWall: IAdminWall): void {
    const modalRef = this.modalService.open(AdminWallDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.adminWall = adminWall;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
