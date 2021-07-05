import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGeneralForum } from '../general-forum.model';
import { GeneralForumService } from '../service/general-forum.service';
import { GeneralForumDeleteDialogComponent } from '../delete/general-forum-delete-dialog.component';

@Component({
  selector: 'jhi-general-forum',
  templateUrl: './general-forum.component.html',
})
export class GeneralForumComponent implements OnInit {
  generalForums?: IGeneralForum[];
  isLoading = false;

  constructor(protected generalForumService: GeneralForumService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.generalForumService.query().subscribe(
      (res: HttpResponse<IGeneralForum[]>) => {
        this.isLoading = false;
        this.generalForums = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGeneralForum): number {
    return item.id!;
  }

  delete(generalForum: IGeneralForum): void {
    const modalRef = this.modalService.open(GeneralForumDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.generalForum = generalForum;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
