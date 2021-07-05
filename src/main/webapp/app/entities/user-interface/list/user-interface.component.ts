import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserInterface } from '../user-interface.model';
import { UserInterfaceService } from '../service/user-interface.service';
import { UserInterfaceDeleteDialogComponent } from '../delete/user-interface-delete-dialog.component';

@Component({
  selector: 'jhi-user-interface',
  templateUrl: './user-interface.component.html',
})
export class UserInterfaceComponent implements OnInit {
  userInterfaces?: IUserInterface[];
  isLoading = false;

  constructor(protected userInterfaceService: UserInterfaceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userInterfaceService.query().subscribe(
      (res: HttpResponse<IUserInterface[]>) => {
        this.isLoading = false;
        this.userInterfaces = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserInterface): number {
    return item.id!;
  }

  delete(userInterface: IUserInterface): void {
    const modalRef = this.modalService.open(UserInterfaceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userInterface = userInterface;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
