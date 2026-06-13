# Guía de Implementación Paso a Paso - PC2: Microscopio

Esta guía detalla los pasos para desarrollar el frontend del examen **PC2** en tu proyecto Angular **Microscopio**, basándose en la estructura y el estilo de desarrollo del proyecto de referencia **webproductos**.

> [!IMPORTANT]
> Reemplaza la palabra **`Apellido`** o **`apellidopaterno`** por tu apellido paterno real (en minúsculas y sin tildes para rutas y nombres de archivos/selectores, ej: `torres`).

---

## 🛠️ Paso 1: Configurar Angular Material en el Proyecto

1. Abre una terminal en la raíz del proyecto `Microscopio` y ejecuta el comando de instalación de Angular Material:
   ```bash
   npx ng add @angular/material
   ```
2. Responde al asistente interactivo con las siguientes opciones:
   - **Choose a prebuilt theme:** Elige uno de los temas predeterminados (ej. `Indigo/Pink` o `Purple/Green`).
   - **Set up global Angular Material typography styles?:** Selecciona **`Yes`** (`Y`).
   - **Set up browser animations?:** Selecciona **`Include and enable animations`**.

---

## 📂 Paso 2: Crear el Entorno (Environments)
En Angular moderno (v19+), la carpeta de entornos no se genera por defecto. Para que el proyecto compile de la misma forma que el de referencia, crea el archivo de configuración de variables de entorno:

### 1. Crear el archivo `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiURL: 'http://localhost:8080/api' // Ajusta el puerto y ruta según tu backend de Spring Boot
};
```

---

## 📐 Paso 3: Crear el Modelo de Datos
Crea la clase de datos para representar al **Microscopio** con los campos solicitados en el PDF.

### 1. Crear el archivo `src/app/model/microscopio.ts`
```typescript
export class Microscopio {
  id: number = 0;
  codigo: string = '';
  marca: string = ''; // OLYMPUS, NIKON, LEICA, ZEISS, CARL_ZEISS
  precio: number = 0;
  fechaFabricacion: Date = new Date();
  estado: boolean = false; // true: en uso, false: disponible
}
```

---

## 🔌 Paso 4: Crear el Servicio de Comunicación (API)
Crea el servicio que enviará las solicitudes HTTP al backend en Spring Boot para realizar el CRUD.

### 1. Crear el archivo `src/app/services/microscopio.service.ts`
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Microscopio } from '../model/microscopio';

@Injectable({
  providedIn: 'root',
})
export class MicroscopioService {
  private apiURL = environment.apiURL;
  private httpClient: HttpClient = inject(HttpClient);
  
  // Subject para notificar cambios en la lista (opcional, útil para refrescar vistas)
  private listaCambio = new Subject<Microscopio[]>();

  list(): Observable<Microscopio[]> {
    return this.httpClient.get<Microscopio[]>(`${this.apiURL}/microscopios`);
  }

  listId(id: number): Observable<Microscopio> {
    return this.httpClient.get<Microscopio>(`${this.apiURL}/microscopio/${id}`);
  }

  insert(microscopio: Microscopio): Observable<any> {
    return this.httpClient.post(`${this.apiURL}/microscopio`, microscopio);
  }

  update(microscopio: Microscopio): Observable<any> {
    return this.httpClient.put(`${this.apiURL}/microscopio`, microscopio);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiURL}/microscopio/${id}`);
  }
}
```

---

## 💬 Paso 5: Componente Diálogo de Confirmación (para Eliminación)
Este componente reutilizable mostrará un mensaje emergente de confirmación de Angular Material antes de proceder a borrar un microscopio.

### 1. Crear el archivo `src/app/componente/confirm-dialog/confirm-dialog.ts`
```typescript
import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
  template: `
    <h2 mat-dialog-title>Confirmar Acción</h2>
    <mat-dialog-content>
      <p>¿Está seguro de que desea eliminar este registro?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialog {}
```

---

## ✍️ Paso 6: Historia de Usuario A (Registrar y Editar)
Debe tener como nombre **`apellidopaterno-crear`** (ej. `torres-crear`) y color de fondo **rosado**.

### 1. Crear archivo TypeScript `src/app/componente/apellidopaterno-crear/apellidopaterno-crear.ts`
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Imports de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { MicroscopioService } from '../../services/microscopio.service';
import { Microscopio } from '../../model/microscopio';

@Component({
  selector: 'app-apellidopaterno-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './apellidopaterno-crear.html',
  styleUrl: './apellidopaterno-crear.css'
})
export class ApellidopaternoCrearComponent implements OnInit {
  microscopioForm: FormGroup;
  edicion: boolean = false;
  id: number = 0;

  // Inyección de servicios usando inject() como el proyecto guía
  private fb: FormBuilder = inject(FormBuilder);
  private microscopioService: MicroscopioService = inject(MicroscopioService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  marcas = ['OLYMPUS', 'NIKON', 'LEICA', 'ZEISS', 'CARL_ZEISS'];

  constructor() {
    this.microscopioForm = this.fb.group({
      id: [''],
      // Formato: 888-8888888 (3 dígitos - guion - 7 dígitos)
      codigo: ['', [Validators.required, Validators.pattern('^\\d{3}-\\d{7}$')]],
      marca: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      fechaFabricacion: ['', [Validators.required, this.fechaValidador]],
      estado: [false, Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.edicion = true;
        this.cargarForm();
      }
    });
  }

  // Validación personalizada: la fecha no debe ser menor a 2022-01-01
  fechaValidador(control: AbstractControl) {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value);
    const fechaMinima = new Date('2022-01-01T00:00:00');
    return fechaSeleccionada < fechaMinima ? { fechaInvalida: true } : null;
  }

  private cargarForm() {
    this.microscopioService.listId(this.id).subscribe((data: Microscopio) => {
      this.microscopioForm.patchValue({
        id: data.id,
        codigo: data.codigo,
        marca: data.marca,
        precio: data.precio,
        fechaFabricacion: data.fechaFabricacion,
        estado: data.estado
      });
    });
  }

  onSubmit() {
    if (this.microscopioForm.valid) {
      const microscopio: Microscopio = this.microscopioForm.value;
      if (!this.edicion) {
        this.microscopioService.insert(microscopio).subscribe(() => {
          this.router.navigate(['/apellidopaterno/listar']);
        });
      } else {
        this.microscopioService.update(microscopio).subscribe(() => {
          this.router.navigate(['/apellidopaterno/listar']);
        });
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
```

### 2. Crear archivo HTML `src/app/componente/apellidopaterno-crear/apellidopaterno-crear.html`
```html
<mat-card class="form-card">
  <mat-card-title>
    <h2>{{ edicion ? 'Editar Microscopio' : 'Registrar Microscopio' }}</h2>
  </mat-card-title>
  <mat-card-content>
    <form [formGroup]="microscopioForm" (ngSubmit)="onSubmit()" class="form-container">
      
      <!-- Código con validación pattern -->
      <mat-form-field appearance="fill">
        <mat-label>Código</mat-label>
        <input matInput formControlName="codigo" placeholder="Ej: 888-8888888" />
        <mat-error *ngIf="microscopioForm.get('codigo')?.hasError('pattern')">
          Formato requerido: 3 dígitos, un guion y 7 dígitos (ej: 123-4567890).
        </mat-error>
        <mat-error *ngIf="microscopioForm.get('codigo')?.hasError('required')">
          El código es obligatorio.
        </mat-error>
      </mat-form-field>

      <!-- Marca (Select de Angular Material) -->
      <mat-form-field appearance="fill">
        <mat-label>Marca</mat-label>
        <mat-select formControlName="marca">
          <mat-option *ngFor="let m of marcas" [value]="m">{{ m }}</mat-option>
        </mat-select>
        <mat-error *ngIf="microscopioForm.get('marca')?.hasError('required')">
          La marca es obligatoria.
        </mat-error>
      </mat-form-field>

      <!-- Precio -->
      <mat-form-field appearance="fill">
        <mat-label>Precio (S/.)</mat-label>
        <input type="number" matInput formControlName="precio" placeholder="Ingrese el precio" />
        <mat-error *ngIf="microscopioForm.get('precio')?.hasError('required')">
          El precio es obligatorio.
        </mat-error>
      </mat-form-field>

      <!-- Fecha de Fabricación (DatePicker) -->
      <mat-form-field appearance="fill">
        <mat-label>Fecha de Fabricación</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="fechaFabricacion" placeholder="DD/MM/YYYY" />
        <mat-hint>DD/MM/YYYY (Mínimo: 01/01/2022)</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="microscopioForm.get('fechaFabricacion')?.hasError('fechaInvalida')">
          La fecha debe ser mayor o igual al 01/01/2022.
        </mat-error>
        <mat-error *ngIf="microscopioForm.get('fechaFabricacion')?.hasError('required')">
          La fecha es obligatoria.
        </mat-error>
      </mat-form-field>

      <!-- Estado (Radio Buttons) -->
      <div class="radio-group-container">
        <label>Estado del Microscopio:</label>
        <mat-radio-group formControlName="estado">
          <mat-radio-button [value]="true">En uso</mat-radio-button>
          <mat-radio-button [value]="false">Disponible</mat-radio-button>
        </mat-radio-group>
      </div>

      <!-- Botón de Registro -->
      <div class="actions">
        <button type="submit" mat-raised-button color="primary">
          {{ edicion ? 'Actualizar' : 'Grabar' }}
        </button>
      </div>
    </form>
  </mat-card-content>
</mat-card>
```

### 3. Crear archivo CSS `src/app/componente/apellidopaterno-crear/apellidopaterno-crear.css`
> [!IMPORTANT]
> El PDF exige que el color utilizado en este componente sea **rosado**.

```css
.form-card {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  /* Color rosado según criterio de aceptación */
  background-color: #fce4ec !important; 
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.radio-group-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.radio-group-container label {
  font-weight: 500;
  color: #3f51b5;
}

mat-radio-button {
  margin-right: 1.5rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
```

---

## 📋 Paso 7: Historia de Usuario B (Listar)
Debe tener como nombre **`apellidopaterno-listar`** (ej. `torres-listar`) y contar con paginación agrupada de **4, 8 y 12 registros**.

### 1. Crear archivo TypeScript `src/app/componente/apellidopaterno-listar/apellidopaterno-listar.ts`
```typescript
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Imports de Angular Material Table y Paginator
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MicroscopioService } from '../../services/microscopio.service';
import { Microscopio } from '../../model/microscopio';

@Component({
  selector: 'app-apellidopaterno-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './apellidopaterno-listar.html',
  styleUrl: './apellidopaterno-listar.css'
})
export class ApellidopaternoListarComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'codigo', 'marca', 'precio', 'fechaFabricacion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Microscopio>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private microscopioService: MicroscopioService = inject(MicroscopioService);

  ngOnInit() {
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarLista() {
    this.microscopioService.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error al cargar microscopios:', err)
    });
  }
}
```

### 2. Crear archivo HTML `src/app/componente/apellidopaterno-listar/apellidopaterno-listar.html`
```html
<div class="table-container mat-elevation-z8">
  <table mat-table [dataSource]="dataSource" matSort>

    <!-- ID Column -->
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
      <td mat-cell *matCellDef="let element"> {{element.id}} </td>
    </ng-container>

    <!-- Código Column -->
    <ng-container matColumnDef="codigo">
      <th mat-header-cell *matHeaderCellDef mat-sort-header> Código </th>
      <td mat-cell *matCellDef="let element"> {{element.codigo}} </td>
    </ng-container>

    <!-- Marca Column -->
    <ng-container matColumnDef="marca">
      <th mat-header-cell *matHeaderCellDef mat-sort-header> Marca </th>
      <td mat-cell *matCellDef="let element"> {{element.marca}} </td>
    </ng-container>

    <!-- Precio Column -->
    <ng-container matColumnDef="precio">
      <th mat-header-cell *matHeaderCellDef mat-sort-header> Precio </th>
      <td mat-cell *matCellDef="let element"> S/. {{element.precio | number:'1.2-2'}} </td>
    </ng-container>

    <!-- Fecha Column -->
    <ng-container matColumnDef="fechaFabricacion">
      <th mat-header-cell *matHeaderCellDef> F. Fabricación </th>
      <td mat-cell *matCellDef="let element"> {{element.fechaFabricacion | date:'dd/MM/yyyy'}} </td>
    </ng-container>

    <!-- Estado Column -->
    <ng-container matColumnDef="estado">
      <th mat-header-cell *matHeaderCellDef> Estado </th>
      <td mat-cell *matCellDef="let element">
        <span class="badge" [ngClass]="element.estado ? 'badge-in-use' : 'badge-available'">
          {{element.estado ? 'En Uso' : 'Disponible'}}
        </span>
      </td>
    </ng-container>

    <!-- Acciones (Editar) -->
    <ng-container matColumnDef="acciones">
      <th mat-header-cell *matHeaderCellDef> Acciones </th>
      <td mat-cell *matCellDef="let element">
        <button mat-icon-button color="primary" [routerLink]="['/apellidopaterno/nuevo', element.id]">
          <mat-icon>edit</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <!-- Paginador con agrupaciones solicitadas: 4, 8 y 12 -->
  <mat-paginator [pageSizeOptions]="[4, 8, 12]" showFirstLastButtons></mat-paginator>
</div>
```

### 3. Crear archivo CSS `src/app/componente/apellidopaterno-listar/apellidopaterno-listar.css`
```css
.table-container {
  margin: 2rem;
  overflow-x: auto;
  border-radius: 8px;
}

table {
  width: 100%;
}

.badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-in-use {
  background-color: #ffebee;
  color: #c62828;
}

.badge-available {
  background-color: #e8f5e9;
  color: #2e7d32;
}
```

---

## 🗑️ Paso 8: Historia de Usuario C (Eliminar)
Debe tener como nombre **`apellidopaterno-eliminar`** (ej. `torres-eliminar`) y mostrar un diálogo de confirmación. Si el usuario acepta, se realiza el borrado y se le redirige al componente Listar (Historia B).

### 1. Crear archivo TypeScript `src/app/componente/apellidopaterno-eliminar/apellidopaterno-eliminar.ts`
```typescript
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// Imports de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MicroscopioService } from '../../services/microscopio.service';
import { Microscopio } from '../../model/microscopio';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-apellidopaterno-eliminar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DatePipe
  ],
  templateUrl: './apellidopaterno-eliminar.html',
  styleUrl: './apellidopaterno-eliminar.css'
})
export class ApellidopaternoEliminarComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'codigo', 'marca', 'precio', 'estado', 'eliminar'];
  dataSource = new MatTableDataSource<Microscopio>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private microscopioService: MicroscopioService = inject(MicroscopioService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  ngOnInit() {
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.microscopioService.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      }
    });
  }

  confirmarEliminacion(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.microscopioService.delete(id).subscribe({
          next: () => {
            // Criterio del PDF: Al eliminar correctamente, se redirige al componente Listar (Historia B)
            this.router.navigate(['/apellidopaterno/listar']);
          },
          error: (err) => console.error('Error al eliminar:', err)
        });
      }
    });
  }
}
```

### 2. Crear archivo HTML `src/app/componente/apellidopaterno-eliminar/apellidopaterno-eliminar.html`
```html
<div class="table-container mat-elevation-z8">
  <div class="header-section">
    <h3>Panel de Eliminación de Microscopios</h3>
  </div>
  <table mat-table [dataSource]="dataSource">

    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef> ID </th>
      <td mat-cell *matCellDef="let element"> {{element.id}} </td>
    </ng-container>

    <ng-container matColumnDef="codigo">
      <th mat-header-cell *matHeaderCellDef> Código </th>
      <td mat-cell *matCellDef="let element"> {{element.codigo}} </td>
    </ng-container>

    <ng-container matColumnDef="marca">
      <th mat-header-cell *matHeaderCellDef> Marca </th>
      <td mat-cell *matCellDef="let element"> {{element.marca}} </td>
    </ng-container>

    <ng-container matColumnDef="precio">
      <th mat-header-cell *matHeaderCellDef> Precio </th>
      <td mat-cell *matCellDef="let element"> S/. {{element.precio | number:'1.2-2'}} </td>
    </ng-container>

    <ng-container matColumnDef="estado">
      <th mat-header-cell *matHeaderCellDef> Estado </th>
      <td mat-cell *matCellDef="let element">
        {{element.estado ? 'En Uso' : 'Disponible'}}
      </td>
    </ng-container>

    <!-- Botón de Eliminar que gatilla el Diálogo -->
    <ng-container matColumnDef="eliminar">
      <th mat-header-cell *matHeaderCellDef> Acción </th>
      <td mat-cell *matCellDef="let element">
        <button mat-raised-button color="warn" (click)="confirmarEliminacion(element.id)">
          <mat-icon>delete</mat-icon> Eliminar
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[5, 10]" showFirstLastButtons></mat-paginator>
</div>
```

### 3. Crear archivo CSS `src/app/componente/apellidopaterno-eliminar/apellidopaterno-eliminar.css`
```css
.table-container {
  margin: 2rem;
  overflow-x: auto;
  border-radius: 8px;
}

.header-section {
  padding: 1rem;
  background-color: #ffebee;
  color: #c62828;
  border-bottom: 2px solid #ef9a9a;
}

table {
  width: 100%;
}
```

---

## 🟢 Paso 9: Historia de Usuario D (Menú y Barra de Navegación)
La barra de navegación debe ser de color **verde** y tener botones **azules** para moverse entre las historias A, B y C.

### 1. Crear archivo TypeScript `src/app/componente/navbar/navbar.ts`
```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Imports de Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {}
```

### 2. Crear archivo HTML `src/app/componente/navbar/navbar.html`
```html
<mat-toolbar color="primary" class="custom-navbar">
  <span>Laboratorio Farmacéutico</span>
  
  <div class="nav-buttons">
    <button mat-raised-button class="nav-btn" routerLink="/apellidopaterno/listar" routerLinkActive="active-btn">
      Listar
    </button>
    <button mat-raised-button class="nav-btn" routerLink="/apellidopaterno/nuevo" routerLinkActive="active-btn">
      Nuevo Microscopio
    </button>
    <button mat-raised-button class="nav-btn" routerLink="/apellidopaterno/eliminar" routerLinkActive="active-btn">
      Eliminar
    </button>
  </div>
</mat-toolbar>
```

### 3. Crear archivo CSS `src/app/componente/navbar/navbar.css`
> [!IMPORTANT]
> El PDF exige que la barra de navegación sea **verde** y sus botones **azules**.

```css
.custom-navbar {
  /* Color verde de fondo */
  background-color: #2e7d32 !important; 
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

/* Botones con color azul */
.nav-btn {
  background-color: #1976d2 !important; 
  color: white !important;
}

.nav-btn:hover {
  background-color: #1565c0 !important;
}

/* Estilo para botón activo */
.active-btn {
  border: 2px solid white;
  font-weight: bold;
}
```

---

## 🔀 Paso 10: Configuración de Rutas
Actualiza las rutas de navegación en tu archivo de enrutamiento principal.

### 1. Modificar `src/app/app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { ApellidopaternoListarComponent } from './componente/apellidopaterno-listar/apellidopaterno-listar';
import { ApellidopaternoCrearComponent } from './componente/apellidopaterno-crear/apellidopaterno-crear';
import { ApellidopaternoEliminarComponent } from './componente/apellidopaterno-eliminar/apellidopaterno-eliminar';

export const routes: Routes = [
  // Ruta por defecto redirige al listado
  { path: '', redirectTo: 'apellidopaterno/listar', pathMatch: 'full' },
  
  // Historias de usuario mapeadas
  { path: 'apellidopaterno/listar', component: ApellidopaternoListarComponent },
  { path: 'apellidopaterno/nuevo', component: ApellidopaternoCrearComponent },
  { path: 'apellidopaterno/nuevo/:id', component: ApellidopaternoCrearComponent }, // Para edición
  { path: 'apellidopaterno/eliminar', component: ApellidopaternoEliminarComponent },
  
  // Comodín para páginas no encontradas
  { path: '**', redirectTo: 'apellidopaterno/listar' }
];
```

---

## 🚀 Paso 11: Renderizar la Aplicación (Paso Final)
Asegura que tu componente raíz muestre la barra de navegación y la salida de las rutas dinámicas.

### 1. Modificar `src/app/app.ts` (Componente Raíz)
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './componente/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      padding: 1.5rem;
    }
  `]
})
export class App {}
```

### 2. Modificar `src/app/app.config.ts`
Asegúrate de registrar `provideHttpClient()` para permitir llamadas HTTP, y `provideAnimationsAsync()` para soportar los componentes interactivos de Angular Material.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
```
