import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatHint, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MicroscopioService } from '../../servicios/microscopio';
import { Router } from '@angular/router';
import { Microscopio } from '../../model/microscopio';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-pilco-registrar',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatDatepicker,
    MatButton,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInput,
    MatSelect,
    MatOption,
  ],
  templateUrl: './pilco-registrar.html',
  styleUrl: './pilco-registrar.css',
})
export class PilcoRegistrar {
  microscopioForm: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  microscopioService: MicroscopioService = inject(MicroscopioService);
  router: Router = inject(Router);
  marcas: string[] = ['OLYMPUS', 'NIKON', 'LEICA', 'ZEISS', 'CARL_ZEISS'];
  constructor() {
    this.microscopioForm = this.fb.group({
      id: [''],
      codigo: ['', [Validators.required, Validators.pattern('^\\d{3}-\\d{7}$')]],
      marca: ['', Validators.required],
      precio: ['', Validators.required],
      fechaFabricacion: ['', [Validators.required, this.fechaMenorA2022]],
      estado: ['', [Validators.required]],
    });
  }

  fechaMenorA2022(control: any) {
    const fecha = new Date(control.value);
    const limite = new Date('2022-01-01');

    if (!control.value) {
      return null;
    }

    return fecha < limite ? null : { fechaInvalida: true };
  }

  ngOnInit() {}
  onSubmit() {
    if (this.microscopioForm.valid) {
      let microscopio = new Microscopio();
      microscopio = this.microscopioForm.value;

      this.microscopioService.insert(microscopio).subscribe((data) => {
        this.router.navigate(['/listar']);
        console.log('Data registrada:', data);
      });
    } else {
      console.log('Formulario no valido');
      alert('Formulario no valido');
    }
  }
}




