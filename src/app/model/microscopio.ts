export class Microscopio {
  id: number;
  codigo: string;
  marca: string;
  precio: number;
  fecha_fabricacion: Date;
  estado: boolean;

  constructor(id: number, codigo: string, marca: string, precio: number, fecha_fabricacion: Date, estado: boolean) {
    this.id = id;
    this.codigo = codigo;
    this.marca = marca;
    this.precio = precio;
    this.fecha_fabricacion = fecha_fabricacion;
    this.estado = estado;
  }
}

//Copil, me dio mucho sueño solo de ver el pdf, dejé un .md con el paso a paso guiado de lo que hizo el profe en clase.
//Confio, hijita
