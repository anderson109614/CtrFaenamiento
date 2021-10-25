import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import {GuiasComponent} from '../../componentes/guias/guias.component';
import {PerfilComponent} from '../../componentes/perfil/perfil.component';
import {NewguiaComponent} from '../../componentes/newguia/newguia.component';
import {UsuariosComponent} from '../../componentes/usuarios/usuarios.component';
import {AreasComponent} from '../../componentes/areas/areas.component';
const routes: Routes = [{ path: 'home', component: HomeComponent,children: [
  { path: 'guias', component: GuiasComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'newguia', component: NewguiaComponent},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'areas', component: AreasComponent}
 ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
