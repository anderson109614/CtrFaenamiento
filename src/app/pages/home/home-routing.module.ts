import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import {GuiasComponent} from '../../componentes/guias/guias.component';
import {PerfilComponent} from '../../componentes/perfil/perfil.component';
import {NewguiaComponent} from '../../componentes/newguia/newguia.component';
import {UsuariosComponent} from '../../componentes/usuarios/usuarios.component';
import {AreasComponent} from '../../componentes/areas/areas.component';
import {ReportesComponent} from '../../componentes/reportes/reportes.component';
import {DashboardComponent} from '../../componentes/dashboard/dashboard.component';
const routes: Routes = [{ path: 'home', component: HomeComponent,children: [
  { path: 'guias', component: GuiasComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'newguia', component: NewguiaComponent},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'areas', component: AreasComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: '', component: DashboardComponent}
 ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
