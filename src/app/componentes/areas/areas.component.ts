import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { EncriptadoService } from '../../servicios/encriptado.service';
import {GuiasService } from '../../servicios/guias.service';
import {Usuario} from '../../modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Area } from 'src/app/modelos/Area';
import { Persona } from 'src/app/modelos/Persona';
import swal from 'sweetalert';
declare var $: any;
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {
  usuarioUso: Usuario={Apellidos:'', Cedula:'',Estado:'', FechaCreacion:{date:''},IdPerfil:'',IdUsuario:'',Imagen:'',NombrePerfil:'',Nombres:'',token:'',};
  listaAreas:any=[];
  listaAreasaux:any=[];
  listaPersonas:any=[];
  listaPersonasaux:any=[];
  areaUso:Area={ IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,public router: Router,private encriSer: EncriptadoService,private guiaSer:GuiasService
  ,private usrSer:UsuariosService) { }

  ngOnInit(): void {
    this.cargarUsuarioUso();
    this.CargarlisataAreas();
  }
  CargarlisataAreas(){
    this.guiaSer.getAreas( this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          if (res.estado) {
            var areas = this.encriSer.desencriptar(res.res, false);
  
            console.log(areas);
            this.listaAreas = areas;
            this.listaAreasaux = areas;
  
          }else{
            this.listaAreas = [];
            this.listaAreasaux = [];
          }

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  cargarUsuarioUso() {
    var us = this.storage.get('Usuario');
    this.usuarioUso = us;
    this.usrSer.verificarPermisos(this.usuarioUso.IdPerfil,'usuarios', this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (!res.estado) {
          this.router.navigateByUrl('/home');

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  cklActualizar(area:Area){
    this.areaUso=area;
    $('#Modalarea').modal('show');
  }
  busquedaareas(ev: any){
    this.listaAreas = this.listaAreasaux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaAreas.filter((area: Area) => area.Codigo.search(value) >= 0
        || area.Descripcion.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Provincia.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Canton.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Parroquia.toUpperCase().search(value.toUpperCase()) >= 0
        );
      this.listaAreas = result;
    } else {
      this.listaAreas = this.listaAreasaux;
    }
  }
  cargarListaPersonas(){
    this.guiaSer.getPersonas( this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          if (res.estado) {
            var personas = this.encriSer.desencriptar(res.res, false);
  
            console.log(personas);
            this.listaPersonas = personas;
            this.listaPersonasaux = personas;
  
          }else{
            this.listaAreas = [];
            this.listaAreasaux = [];
          }

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  SelecPersona(persona:Persona){
    console.log('per sel',persona);
    this.areaUso.IdPropietario=persona.IdPersona;
    this.areaUso.Propietario=persona;
  }
  abrirModalListaPersonas(){
    $('#ModalListaPersonas').modal('show');
    this.cargarListaPersonas();
  }
  clkGuardarACT(){
    this.areaUso.Descripcion=(<HTMLInputElement>document.getElementById('txtDescripcionACT')).value;
    this.areaUso.Provincia=(<HTMLInputElement>document.getElementById('txtProvinciaACT')).value;
    this.areaUso.Canton=(<HTMLInputElement>document.getElementById('txtCantonACT')).value;
    this.areaUso.Parroquia=(<HTMLInputElement>document.getElementById('txtParroquiaACT')).value;
    this.areaUso.Direccion=(<HTMLInputElement>document.getElementById('txtDireccionACT')).value;
    this.areaUso.CodPredial=(<HTMLInputElement>document.getElementById('txtCodPredialACT')).value;
    this.areaUso.Codigo=(<HTMLInputElement>document.getElementById('txtCodigoACT')).value;
    if (this.validarArea(this.areaUso)) {

      this.guiaSer.ActualizarArea(this.areaUso, this.usuarioUso.token).subscribe(
          res => {
              console.log(res);
              if (res.estado) {
                 
                  this.CargarlisataAreas();
                  $('#Modalarea').modal('hide');
              } else {
                  this.mesajeError('Error al guardar');
              }
          },
          err => {

              console.log(err);
              this.mesajeError('Error al guardar');
          }
      );
  }
  }

  validarArea(area: Area) {
    console.log('arr',area);
    if (area.Canton.length == 0) {
        this.mesajeError('Ingrese canton');
        return false;
    }
    if (area.Parroquia.length == 0) {
        this.mesajeError('Ingrese Parroquia');
        return false;
    }
    if (area.Provincia.length == 0) {
        this.mesajeError('Ingrese Provincia');
        return false;
    }
    if (area.CodPredial.length == 0) {
        this.mesajeError('Ingrese Codigo Predial');
        return false;
    }
    if (area.Direccion.length == 0) {
        this.mesajeError('Ingrese Direción');
        return false;
    }
    if (area.Descripcion.length == 0) {
        this.mesajeError('Ingrese Descripcion');
        return false;
    }
    if (area.IdPropietario.length == 0) {
        this.mesajeError('No se a ingresado un propietario');
        return false;
    }
    if (area.Codigo.length == 0) {
        this.mesajeError('Ingrese Codigo');
        return false;
    }

    return true;
}
mesajeError(texto: string) {
  swal({
      title: "Error!",
      text: texto,
      icon: "warning",

  });
}
clknuevaArea(){
  $('#ModalNuevaArea').modal('show');
   this.areaUso={ IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
  
}
clkGuardarNewArea(){
  this.areaUso.Descripcion=(<HTMLInputElement>document.getElementById('txtDescripcionNEW')).value;
  this.areaUso.Provincia=(<HTMLInputElement>document.getElementById('txtProvinciaNEW')).value;
  this.areaUso.Canton=(<HTMLInputElement>document.getElementById('txtCantonNEW')).value;
  this.areaUso.Parroquia=(<HTMLInputElement>document.getElementById('txtParroquiaNEW')).value;
  this.areaUso.Direccion=(<HTMLInputElement>document.getElementById('txtDireccionNEW')).value;
  this.areaUso.CodPredial=(<HTMLInputElement>document.getElementById('txtCodPredialNEW')).value;
  this.areaUso.Codigo=(<HTMLInputElement>document.getElementById('txtCodigoNEW')).value;
  if (this.validarArea(this.areaUso)) {

    this.guiaSer.guardarArea(this.areaUso, this.usuarioUso.token).subscribe(
        res => {
            console.log(res);
            if (res.estado) {
               
                this.CargarlisataAreas();
                $('#ModalNuevaArea').modal('hide');
            } else {
                this.mesajeError('Error al guardar');
            }
        },
        err => {

            console.log(err);
            this.mesajeError('Error al guardar');
        }
    );
}
}
busquedaPersonas(ev: any){
  this.listaPersonas = this.listaPersonasaux;

  let value = (<HTMLInputElement>ev.target).value;
  //console.log('value', value);
  if (value != "") {
    const result = this.listaPersonas.filter((persona: Persona) => 
      persona.Cedula.toUpperCase().search(value.toUpperCase()) >= 0
      || persona.Nombres.toUpperCase().search(value.toUpperCase()) >= 0
     
      );
    this.listaPersonas = result;
  } else {
    this.listaPersonas = this.listaPersonasaux;
  }
}

}
