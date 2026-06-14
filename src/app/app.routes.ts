import { Routes } from '@angular/router';
import { PilcoRegistrar } from './componentes/pilco-registrar/pilco-registrar';
import { PilcoListar } from './componentes/pilco-listar/pilco-listar';
import { PilcoEliminar } from './componentes/pilco-eliminar/pilco-eliminar';

export const routes: Routes = [
  { path: '', component: PilcoListar },
  { path: 'home', component: PilcoListar },
  { path: 'registrar', component: PilcoRegistrar },
  { path: 'listar', component: PilcoListar },
  { path: 'eliminar', component: PilcoEliminar },

];
