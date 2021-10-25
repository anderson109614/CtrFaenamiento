import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { GuiasComponent } from './componentes/guias/guias.component';
import { HttpClientModule } from '@angular/common/http';
import {HomeModule} from './pages/home/home.module';

import { NgQrScannerModule } from 'angular2-qrscanner';

import { PerfilComponent } from './componentes/perfil/perfil.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NewguiaComponent } from './componentes/newguia/newguia.component';
import { AreasComponent } from './componentes/areas/areas.component';
import { PersonasComponent } from './componentes/personas/personas.component';
import { VehiculosComponent } from './componentes/vehiculos/vehiculos.component';
import { ReportesComponent } from './componentes/reportes/reportes.component';


@NgModule({
  declarations: [
    AppComponent,
   
    PerfilComponent,
    UsuariosComponent,
    NewguiaComponent,
    AreasComponent,
    PersonasComponent,
    VehiculosComponent,
    ReportesComponent
  ],
  imports: [
    BrowserModule,
    HomeModule,
    AppRoutingModule,
    HttpClientModule,
    NgQrScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
