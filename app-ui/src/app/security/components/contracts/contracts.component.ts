import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { Contract } from '../../models/contracts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'duration', 'start', 'delete', 'edit'];
  public dataSource: MatTableDataSource<Contract> = {} as MatTableDataSource<Contract>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getContracts();
    // this.dataSource!.data = [
    //   {
    //     id: 1,
    //     name: "test",
    //     description: "descrption",
    //     duration: 18,
    //     start: 15
    //   }
    // ];
  }

  private getContracts(): void {
    this.api.getContracts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((contracts: Contract[]) => {
        if (contracts) {
          this.dataSource!.data = contracts;
        }
      });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(ContractsCreationComponent, {
      data: {
        contract: {
          id: 0,
          name: '',
          description: '',
          duration: 12,
          start: 1
        },
        isAdding: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.added) {
        let data = this.dataSource.data;
        data.push(result.contract);
        this.dataSource.data = data;
      }
    });
  }

  public onDelete(contract: Contract): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Contract",
        message: `Would you like to delete contract '${contract.name}?'`,
        endpointPath: "contracts/",
        id: contract.id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let data = this.dataSource.data;
        const index = data.indexOf(contract, 0);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = data;
        }
      }
    });
  }

  public onEdit(contract: Contract): void {
    let dialogRef = this.dialog.open(ContractsCreationComponent, {
      data: {
        contract: contract,
        isAdding: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated) {
        let old = this.dataSource.data.find(x => x.id === contract.id);
        if (old) {
          old.name = result.contract.name;
          old.description = result.contract.description;
          old.duration = result.contract.duration;
          old.start = result.contract.start;
        }
      }
    });
  }
}
