import { Component, inject, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Microscopio } from '../../model/microscopio';
import { MicroscopioService } from '../../servicios/microscopio';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogo } from './confirm.dialogo/confirm.dialogo';

@Component({
  selector: 'app-pilco-eliminar',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    DatePipe,
    MatSortHeader,
    MatButton,
  ],
  templateUrl: './pilco-eliminar.html',
  styleUrl: './pilco-eliminar.css',
})
export class PilcoEliminar {
  lista: Microscopio[];
  displayedColumns: string[] = [
    'id',
    'codigo',
    'marca',
    'precio',
    'fechaFabricacion',
    'estado',
    'eliminar',
  ];
  dataSource: MatTableDataSource<Microscopio> = new MatTableDataSource<Microscopio>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  miscroscopioService: MicroscopioService = inject(MicroscopioService);
  route: Router = inject(Router);
  dialog = inject(MatDialog);

  constructor() {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    console.log('ngOnInit llamando a la API Get');
    this.miscroscopioService.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Trae:', data);
        this.dataSource._updateChangeSubscription();
      },
    });
  }
  borrar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogo);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminar(id);
      } else {
        console.log('No se eligió eliminar');
      }
    });
  }
  eliminar(id: number) {
    this.miscroscopioService.delete(id).subscribe({
      next: (data) => {
        this.cargarLista();
      },
    });
  }
  cargarLista() {
    this.miscroscopioService.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Trae:', data);
        this.dataSource._updateChangeSubscription();
      },
    });
  }
}
