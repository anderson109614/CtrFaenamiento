import { Component, Inject, OnInit } from '@angular/core';
import { GuiasService } from '../../servicios/guias.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { EncriptadoService } from '../../servicios/encriptado.service';
import { Area } from '../../modelos/Area';
import { Persona } from '../../modelos/Persona';
import { Vehiculo } from '../../modelos/Vehiculo';
import { Detalle } from '../../modelos/Detalle';
import { Guia } from '../../modelos/Guia';
import { Fecha } from '../../modelos/fecha';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
declare var $: any;
@Component({
  selector: 'app-guias',
  templateUrl: './guias.component.html',
  styleUrls: ['./guias.component.css']
})
export class GuiasComponent implements OnInit {
  usuarioUso: any = {};
  listaGias: Guia[] = [];
  listaGiasAux: Guia[] = [];
  fechaInicio: string = '';
  fechaInicioHora: string = '';
  fechaFinaliza: string = '';
  fechaFinalizaHora: string = '';
  fechaEmicion: string = '';
  fechaEmicionHora: string = '';
  guiaUso: Guia = {
    Vehiculo: { IdPersonaPer: '', IdVehiculo: '', Placa: '', Tipo: '' }
    , FechaInicio: { date: '' }
    , FechaFinaliza: { date: '' }
    , Numero: ''
    , AreaDestino: { Sitio: '', Canton: '', Descripcion: '', Finalidad: '', Codigo: '', IdArea: '', Parroquia: '', Provincia: '' }
    , AreaOrigen: { Sitio: '', Canton: '', Descripcion: '', Finalidad: '', Codigo: '', IdArea: '', Parroquia: '', Provincia: '' }
    , IdGia: ''
    , FechaEmision: { date: '' }
    , LugarOrigen: ''
    , PersonaAutorizada: { Cedula: '', Id: '', Nombres: '' }
    , Ruta: ''
    , TipoEmision: ''
    , TotalProductos: 0
    , Usuario: { Nombres: '', Cedula: '', Apellidos: '', Estado: '', FechaCreacion: {date:''}, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', token: '' }
    , listaDetalles: []
  };
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router, private guiasSer: GuiasService, private encriSer: EncriptadoService,private usrSer:UsuariosService) { }

  ngOnInit(): void {
    this.cargarUsuarioUso();
    this.CargarListaGuias();

  }
  cargarUsuarioUso() {
    var us = this.storage.get('Usuario');
    this.usuarioUso = us;
    this.usrSer.verificarPermisos(this.usuarioUso.IdPerfil,'guias', this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (!res.estado) {
          this.router.navigateByUrl('/home');

        }
      },
      err => {

        console.log('mm',err);
      }
    );

  }
  CargarListaGuias() {
    this.guiasSer.getGuias(this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var guias = this.encriSer.desencriptar(res.res, false);

          console.log(guias);
          this.listaGias = guias;
          this.listaGiasAux = guias;

        }else{
          this.listaGias = [];
          this.listaGiasAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );
  }
  busquedaGuias(ev: any) {
    // console.log(ev);
    this.listaGias = this.listaGiasAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaGias.filter((guia: Guia) => guia.Numero.search(value) >= 0

        || guia.LugarOrigen.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.Ruta.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.TipoEmision.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.TotalProductos.toString().search(value.toUpperCase()) >= 0
        || guia.AreaOrigen.Codigo.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.AreaOrigen.Provincia.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.AreaOrigen.Canton.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.AreaOrigen.Parroquia.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.AreaOrigen.Sitio.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.PersonaAutorizada.Cedula.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.PersonaAutorizada.Nombres.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.Vehiculo.Placa.toUpperCase().search(value.toUpperCase()) >= 0);
      this.listaGias = result;
    } else {
      this.listaGias = this.listaGiasAux;
    }
    /*
    || guia.FechaEmision.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.FechaFinaliza.toUpperCase().search(value.toUpperCase()) >= 0
        || guia.FechaInicio.toUpperCase().search(value.toUpperCase()) >= 0
    */
  }
  clkRedNew() {
    this.router.navigate(['home/newguia/']);
  }
  changeRadio(e: any) {
    console.log(e.target.value);
    if (e.target.value == "Todos") {
      this.listaGias = this.listaGiasAux;
    } else {
      const result = this.listaGias.filter((guia: Guia) => guia.Usuario.IdUsuario.toString().search(this.usuarioUso.IdUsuario) >= 0);
      this.listaGias = result;
    }
  }
  changeValid() {
    var listaImput = document.getElementsByClassName('form-control required');
    for (let index = 0; index < listaImput.length; index++) {
      if (!(<HTMLInputElement>listaImput[index]).disabled && (<HTMLInputElement>listaImput[index]).value.length != 0) {
        (<HTMLInputElement>listaImput[index]).classList.remove('is-invalid');
        (<HTMLInputElement>listaImput[index]).classList.add('is-valid');

      } else {
        (<HTMLInputElement>listaImput[index]).classList.remove('is-valid');
        (<HTMLInputElement>listaImput[index]).classList.add('is-invalid');
      }

    }
  }
  clickEliminar(guia: Guia) {
    /*
    ,
      text: "Once deleted, you will not be able to recover this imaginary file!",
    */
   
    swal({
      title: "Seguro que desea eliminar?",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.guiasSer.EliminarGuia(guia, this.usuarioUso.token).subscribe(
            res => {
              console.log(res);
              if (res.estado) {
                this.CargarListaGuias();
                swal("Registro eliminado", {
                  icon: "success",
                });
    
    
              } else {
                this.mesajeError('Error al eliminar informacion...!!');
              }
            },
            err => {
    
              console.log(err);
              this.mesajeError('Error al eliminar informacion...!!');
            }
          );

          
        } else {

        }
      });
  }
  cklActualizar(gui: Guia) {
    console.log(gui);
    this.guiaUso = gui;
    this.fechaEmicion = this.fomatoFechaHora(gui.FechaEmision.date)[0];
    this.fechaEmicionHora = this.fomatoFechaHora(gui.FechaEmision.date)[1];

    this.fechaInicio = this.fomatoFechaHora(gui.FechaInicio.date)[0];
    this.fechaInicioHora = this.fomatoFechaHora(gui.FechaInicio.date)[1];

    this.fechaFinaliza = this.fomatoFechaHora(gui.FechaFinaliza.date)[0];
    this.fechaFinalizaHora = this.fomatoFechaHora(gui.FechaFinaliza.date)[1];

    $('#ModalGuia').modal('show');
  }
  fomatoFechaHora(date: string): string[] {
    var sep = date.split(' ');
    //var SepFecha=sep[0].split('/');
    //var fecha=SepFecha[2]+ "-"+SepFecha[1]+ "-"+SepFecha[0];
    var sepHora = sep[1].split('.');
    console.log([sep[0], sepHora[0]]);
    return [sep[0], sepHora[0]];
  }
  validarGuardado() {
    var ret = true;
    var listaImput = document.getElementsByClassName('form-control required');
    for (let index = 0; index < listaImput.length; index++) {
      if (!(<HTMLInputElement>listaImput[index]).disabled && (<HTMLInputElement>listaImput[index]).value.length == 0) {
        (<HTMLInputElement>listaImput[index]).classList.add('is-invalid');
        ret = false;
      }

    }

    if (ret) {

      return ret;
    } else {
      this.mesajeError('Datos Incompletos...!!');
      return ret;
    }

  }
  ChangeHoraEmicion() {
    // console.log(percent);
    (<HTMLInputElement>document.getElementById('txtHoraInia')).value = (<HTMLInputElement>document.getElementById('txtHoraEmicion')).value;

  }
  ChangeFechaEmicion() {
    // console.log(percent);
    (<HTMLInputElement>document.getElementById('txtFechaInicia')).value = (<HTMLInputElement>document.getElementById('txtFechaEmicion')).value;

  }
  mesajeError(texto: string) {
    swal({
      title: "Error!",
      text: texto,
      icon: "warning",

    });
  }
  clkActualizar() {
    if (this.validarGuardado()) {
      this.guiaUso.TipoEmision = (<HTMLInputElement>document.getElementById('txtTipoEmicion')).value;
      this.guiaUso.Ruta = (<HTMLInputElement>document.getElementById('txtRuta')).value;
      this.guiaUso.LugarOrigen = (<HTMLInputElement>document.getElementById('txtLugarOrigen')).value;
      this.guiaUso.FechaEmision = { date: (<HTMLInputElement>document.getElementById('txtFechaEmicion')).value + ' ' + (<HTMLInputElement>document.getElementById('txtHoraEmicion')).value };
      this.guiaUso.FechaInicio = { date: (<HTMLInputElement>document.getElementById('txtFechaInicia')).value + ' ' + (<HTMLInputElement>document.getElementById('txtHoraInia')).value };

      console.log(this.guiaUso);
      this.guiasSer.actualizarrGuia(this.guiaUso, this.usuarioUso.token).subscribe(
        res => {
          console.log(res);
          if (res.estado) {
            this.CargarListaGuias();
            this.limpiar();
            $('#ModalGuia').modal('hide')


          } else {
            this.mesajeError('Error al guardar informacion...!!');
          }
        },
        err => {

          console.log(err)
        }
      );


    }
  }
  limpiar() {
    var listaImput = document.getElementsByClassName('form-control');
    for (let index = 0; index < listaImput.length; index++) {
      (<HTMLInputElement>listaImput[index]).value = "";
      (<HTMLInputElement>listaImput[index]).classList.remove('is-invalid');
      (<HTMLInputElement>listaImput[index]).classList.remove('is-valid');
    }
    this.guiaUso = {
      Vehiculo: { IdPersonaPer: '', IdVehiculo: '', Placa: '', Tipo: '' }
      , FechaInicio: { date: '' }
      , FechaFinaliza: { date: '' }
      , Numero: ''
      , AreaDestino: { Sitio: '', Canton: '', Descripcion: '', Finalidad: '', Codigo: '', IdArea: '', Parroquia: '', Provincia: '' }
      , AreaOrigen: { Sitio: '', Canton: '', Descripcion: '', Finalidad: '', Codigo: '', IdArea: '', Parroquia: '', Provincia: '' }
      , IdGia: ''
      , FechaEmision: { date: '' }
      , LugarOrigen: ''
      , PersonaAutorizada: { Cedula: '', Id: '', Nombres: '' }
      , Ruta: ''
      , TipoEmision: ''
      , TotalProductos: 0
      , Usuario: { Nombres: '', Cedula: '', Apellidos: '', Estado: '', FechaCreacion: {date:''}, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', token: '' }
      , listaDetalles: []
    }
    this.fechaEmicion = "";
    this.fechaEmicionHora = "";
    this.fechaInicio = "";
    this.fechaInicioHora = "";

    this.fechaFinaliza = "";
    this.fechaFinalizaHora = "";
  }

}
