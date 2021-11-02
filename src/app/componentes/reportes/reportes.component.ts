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
import { ReportesService } from 'src/app/servicios/reportes.service';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Usuario } from 'src/app/modelos/Usuario';
declare var $: any;
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  usuarioUso: any = {};
  listaGias: Guia[] = [];
  listaGiasAux: Guia[] = [];
  listaPersonas: Persona[] = [];
  listaPersonasAux: Persona[] = [];
  listaUsuarios: Usuario[] = [];
  listaUsuariosAux: Usuario[] = [];
  listavehiculos: Vehiculo[] = [];
  listaVehiculosAux: Vehiculo[] = [];
  listaAreas: Area[] = [];
  listaAreassAux: Area[] = [];
  fechaInicio: string = '';
  fechaInicioHora: string = '';
  fechaFinaliza: string = '';
  fechaFinalizaHora: string = '';
  fechaEmicion: string = '';
  fechaEmicionHora: string = '';
  PersonaSelec: Persona = { IdPersona: '', Cedula: '', Nombres: '' };
  usuarioSelec: Usuario = { Apellidos: '', Cedula: '', Estado: '', FechaCreacion: { date: '' }, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', Nombres: '', token: '', };
  areaOrigenSelec: Area = { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } };
  areaDestinoSelec: Area = { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } };
  vehiculoSelec: Vehiculo = { IdVehiculo: '', IdPersonaPer: '', Placa: '', Tipo: '' };
  guiaUso: Guia = {
    Vehiculo: { IdPersonaPer: '', IdVehiculo: '', Placa: '', Tipo: '' }
    , FechaInicio: { date: '' }
    , FechaFinaliza: { date: '' }
    , Numero: ''
    , AreaDestino: { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } }
    , AreaOrigen: { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } }
    , IdGia: ''
    , FechaEmision: { date: '' }
    , LugarOrigen: ''
    , PersonaAutorizada: { Cedula: '', IdPersona: '', Nombres: '' }
    , Ruta: ''
    , TipoEmision: ''
    , TotalProductos: 0
    , Usuario: { Nombres: '', Cedula: '', Apellidos: '', Estado: '', FechaCreacion: { date: '' }, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', token: '' }
    , listaDetalles: []
  };
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router, private guiasSer: GuiasService, 
  private encriSer: EncriptadoService, private usrSer: UsuariosService,private repSer:ReportesService) { }

  ngOnInit(): void {
    this.cargarUsuarioUso();
    this.CargarListaGuias();

  }
  cargarUsuarioUso() {
    var us = this.storage.get('Usuario');
    this.usuarioUso = us;
    this.usrSer.verificarPermisos(this.usuarioUso.IdPerfil, 'guias', this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (!res.estado) {
          this.router.navigateByUrl('/home');

        }
      },
      err => {

        console.log('mm', err);
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

        } else {
          this.listaGias = [];
          this.listaGiasAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );
  }
  CargarListaPersonas() {
    this.guiasSer.getPersonas(this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var result = this.encriSer.desencriptar(res.res, false);

          console.log(result);
          this.listaPersonas = result;
          this.listaPersonasAux = result;

        } else {
          this.listaGias = [];
          this.listaGiasAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );
  }
  CargarListaUsuarios() {
    this.usrSer.getUsuarios(this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var result = this.encriSer.desencriptar(res.res, false);

          console.log(result);
          this.listaUsuarios = result;
          this.listaUsuariosAux = result;

        } else {
          this.listaGias = [];
          this.listaGiasAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );
  }
  CargarListaVehiculos() {
    this.guiasSer.getVehiculos(this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var result = this.encriSer.desencriptar(res.res, false);

          console.log(result);
          this.listavehiculos = result;
          this.listaVehiculosAux = result;

        } else {
          this.listaGias = [];
          this.listaGiasAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );
  }
  CargarListaAreas() {
    this.guiasSer.getAreas(this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var result = this.encriSer.desencriptar(res.res, false);

          console.log(result);
          this.listaAreas = result;
          this.listaAreassAux = result;

        } else {
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
        // || guia.AreaOrigen.Sitio.toUpperCase().search(value.toUpperCase()) >= 0
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

  cklModalPersonas() {
    this.CargarListaPersonas();
    $('#ModalPersonas').modal('show');
  }
  busquedaPersonas(ev: any) {
    this.listaPersonas = this.listaPersonasAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaPersonas.filter((persona: Persona) =>
        persona.Cedula.toUpperCase().search(value.toUpperCase()) >= 0
        || persona.Nombres.toUpperCase().search(value.toUpperCase()) >= 0

      );
      this.listaPersonas = result;
    } else {
      this.listaPersonas = this.listaPersonasAux;
    }
  }
  personaBoll:boolean=false;
  SelecPersona(person: Persona) {
    this.PersonaSelec = person;
    this.personaBoll=true;
  }
  cklModalUsuarios() {
    this.CargarListaUsuarios();
    $('#ModalUsuarios').modal('show');
  }
  busquedaUsuario(ev: any) {
    this.listaUsuarios = this.listaUsuariosAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaUsuarios.filter((user: Usuario) =>
        user.Cedula.toUpperCase().search(value.toUpperCase()) >= 0
        || user.Nombres.toUpperCase().search(value.toUpperCase()) >= 0
        || user.Apellidos.toUpperCase().search(value.toUpperCase()) >= 0
      );
      this.listaUsuarios = result;
    } else {
      this.listaPersonas = this.listaPersonasAux;
    }
  }
  usuarioBoll:boolean=false;
  SelecUsuario(usr: Usuario) {
    this.usuarioSelec = usr;
    this.usuarioBoll=true;
  }
  cklModalVehiculos() {
    this.CargarListaVehiculos();
    $('#ModalVehiculos').modal('show');
  }

  cklModalAreaOrigen() {
    this.CargarListaAreas();
    $('#ModalareaOrigen').modal('show');
  }
  busquedaArea(ev: any) {
    this.listaAreas = this.listaAreassAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaAreas.filter((area: Area) =>
        area.Codigo.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Descripcion.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Direccion.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Provincia.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Canton.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Parroquia.toUpperCase().search(value.toUpperCase()) >= 0
      );
      this.listaAreas = result;
    } else {
      this.listaPersonas = this.listaPersonasAux;
    }
  }
  busquedaVehiculo(ev: any) {
    this.listavehiculos = this.listaVehiculosAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listavehiculos.filter((area: Vehiculo) =>
        area.Placa.toUpperCase().search(value.toUpperCase()) >= 0
        || area.Tipo.toUpperCase().search(value.toUpperCase()) >= 0

      );
      this.listavehiculos = result;
    } else {
      this.listavehiculos = this.listaVehiculosAux;
    }
  }
  areaOrigenbool:boolean=false;
  SelecAreaOrigen(usr: Area) {
    this.areaOrigenSelec = usr;
    this.areaOrigenbool=true;
  }
  vehiculoBoll:boolean=false;
  SelecVehiculo(usr: Vehiculo) {
    this.vehiculoSelec = usr;
    this.vehiculoBoll=true;
  }
  fechaEmicionBoll:boolean=false;
  ChangeFechaEmicion() {
    // console.log(percent);
    (<HTMLInputElement>document.getElementById('txtFechaEmisionT')).value = (<HTMLInputElement>document.getElementById('txtFechaEmisionI')).value;
    (<HTMLInputElement>document.getElementById('txtFechaEmisionT')).disabled = false;
    (<HTMLInputElement>document.getElementById('txtFechaEmisionT')).min = (<HTMLInputElement>document.getElementById('txtFechaEmisionI')).value;
    this.fechaEmicionBoll=true;

  }
  fechaIniciaBoll:boolean=false;
  ChangeFechaInicia() {
    // console.log(percent);
    (<HTMLInputElement>document.getElementById('txtFechaInicaT')).value = (<HTMLInputElement>document.getElementById('txtFechaInicaI')).value;
    (<HTMLInputElement>document.getElementById('txtFechaInicaT')).disabled = false;
    (<HTMLInputElement>document.getElementById('txtFechaInicaT')).min = (<HTMLInputElement>document.getElementById('txtFechaInicaI')).value;
    this.fechaIniciaBoll=true;

  }
  fechaFinalBoll:boolean=false;
  ChangeFechaTermina() {
    // console.log(percent);
    (<HTMLInputElement>document.getElementById('txtFechaFinalT')).value = (<HTMLInputElement>document.getElementById('txtFechaFinalI')).value;
    (<HTMLInputElement>document.getElementById('txtFechaFinalT')).disabled = false;
    (<HTMLInputElement>document.getElementById('txtFechaFinalT')).min = (<HTMLInputElement>document.getElementById('txtFechaFinalI')).value;
    this.fechaFinalBoll=true;

  }
  clkgenerarConsulta(){
    var consulta="WHERE ";
    var añadirAND:boolean=false;
    if(this.personaBoll){
      consulta+= ' IdPersonaAutorizada='+this.PersonaSelec.IdPersona;
      añadirAND=true;
    }
    if(this.usuarioBoll){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=' IdUsuario= '+ this.usuarioSelec.IdUsuario;
      añadirAND=true;
    }
    if(this.vehiculoBoll){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=' IdVehiculo='+ this.vehiculoSelec.IdVehiculo;
      añadirAND=true;
    }
    if(this.areaOrigenbool){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=' IdAreaOrigen='+ this.areaOrigenSelec.IdArea;
      añadirAND=true;
    }
    if(this.fechaEmicionBoll){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=" FechaEmision BETWEEN '"+ (<HTMLInputElement>document.getElementById('txtFechaEmisionI')).value +"' AND '"+(<HTMLInputElement>document.getElementById('txtFechaEmisionT')).value+"'";
      añadirAND=true;
    }
    if(this.fechaIniciaBoll){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=" FechaInicio BETWEEN '"+ (<HTMLInputElement>document.getElementById('txtFechaInicaI')).value +"' AND '"+(<HTMLInputElement>document.getElementById('txtFechaInicaT')).value+"'";
      añadirAND=true;
    }
    if(this.fechaFinalBoll){
      if(añadirAND){
        consulta+=' AND ';
      }
      consulta+=" FechaFinaliza BETWEEN '"+ (<HTMLInputElement>document.getElementById('txtFechaFinalI')).value +"' AND '"+(<HTMLInputElement>document.getElementById('txtFechaFinalT')).value+"'";
      añadirAND=true;
    }
    console.log('consulta',consulta);
    this.repSer.getGias(consulta,this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var result = this.encriSer.desencriptar(res.res, false);

          console.log(result);
          this.listaGias = result;
          this.listaAreassAux = result;

        } else {
          this.listaGias = [];
          this.listaAreassAux = [];
        }
      },
      err => {

        console.log(err)
      }
    );

  }
  clkLimpiar(){
    this.CargarListaGuias();
    this. PersonaSelec = { IdPersona: '', Cedula: '', Nombres: '' };
    this.usuarioSelec = { Apellidos: '', Cedula: '', Estado: '', FechaCreacion: { date: '' }, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', Nombres: '', token: '', };
    this.areaOrigenSelec = { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } };
    this.areaDestinoSelec = { IdArea: '', Canton: '', Codigo: '', Descripcion: '', Parroquia: '', Provincia: '', CodPredial: '', Direccion: '', IdPropietario: '', Propietario: { Cedula: '', IdPersona: '', Nombres: '' } };
    this.vehiculoSelec = { IdVehiculo: '', IdPersonaPer: '', Placa: '', Tipo: '' };
    this.areaOrigenbool=false;
    this.vehiculoBoll=false;
    this.fechaEmicionBoll=false;
    this.fechaIniciaBoll=false;
    this.fechaFinalBoll=false;

    this.personaBoll=false;
    this.usuarioBoll=false;
    this.vehiculoBoll=false;
    this.areaOrigenbool=false;
    (<HTMLInputElement>document.getElementById('txtFechaEmisionI')).value ="";
    (<HTMLInputElement>document.getElementById('txtFechaEmisionT')).value="";
    (<HTMLInputElement>document.getElementById('txtFechaEmisionT')).disabled=true;

    (<HTMLInputElement>document.getElementById('txtFechaInicaI')).value ="";
    (<HTMLInputElement>document.getElementById('txtFechaInicaT')).value ="";
    (<HTMLInputElement>document.getElementById('txtFechaInicaT')).disabled=true;
    
    (<HTMLInputElement>document.getElementById('txtFechaFinalI')).value ="" ;
    (<HTMLInputElement>document.getElementById('txtFechaFinalT')).value ="";
    (<HTMLInputElement>document.getElementById('txtFechaFinalT')).disabled=true;


  }



  clkverPdf() {

    let jsonGias:any=[];
    for (let index = 0; index < this.listaGias.length; index++) {
      var aux={
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [ '*', '*'],
         
          body: [
            [{ text: this.listaGias[index].Numero, style: 'tableHeader', colSpan: 2, alignment: 'left' },  { }],
            [{ text: 'AUTORIZADO PARA MOVILIZAR', style: 'tableHeader', alignment: 'center' ,colSpan: 2,fillColor:'blue',fillOpacity:0.60}, {  }],
            [{ text: 'CC/CI/RUC: '+this.listaGias[index].PersonaAutorizada.Cedula, style: 'tableHeader', alignment: 'center' }, { text: 'Tipo: '+this.listaGias[index].TipoEmision, style: 'tableHeader', alignment: 'center' ,}],
            [{ text: 'Autorizado: '+this.listaGias[index].PersonaAutorizada.Nombres, style: 'tableHeader', alignment: 'center' }, { }],
            [{ text: 'Origen ', style: 'tableHeader', alignment: 'center',fillColor:'blue',fillOpacity:0.60 }, { text: 'Destino', style: 'tableHeader', alignment: 'center' ,fillColor:'blue',fillOpacity:0.60}],
            [{ text: 'Descipción: '+this.listaGias[index].AreaOrigen.Descripcion, style: 'tableHeader', alignment: 'left' }, { text: 'Descipción: '+this.listaGias[index].AreaDestino.Descripcion, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'CC/CI/RUC: '+this.listaGias[index].AreaOrigen.Propietario.Cedula, style: 'tableHeader', alignment: 'left' }, { text: 'CC/CI/RUC: '+this.listaGias[index].AreaDestino.Propietario.Cedula, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Propietario: '+this.listaGias[index].AreaOrigen.Propietario.Nombres, style: 'tableHeader', alignment: 'left' }, { text: 'Propietario: '+this.listaGias[index].AreaDestino.Propietario.Nombres, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Provincia: '+this.listaGias[index].AreaOrigen.Provincia, style: 'tableHeader', alignment: 'left' }, { text: 'Provincia: '+this.listaGias[index].AreaDestino.Provincia, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Cantón: '+this.listaGias[index].AreaOrigen.Canton, style: 'tableHeader', alignment: 'left' }, { text: 'Cantón: '+this.listaGias[index].AreaDestino.Canton, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Parroquia: '+this.listaGias[index].AreaOrigen.Parroquia, style: 'tableHeader', alignment: 'left' }, { text: 'Parroquia: '+this.listaGias[index].AreaDestino.Parroquia, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Dirección: '+this.listaGias[index].AreaOrigen.Direccion, style: 'tableHeader', alignment: 'left' }, { text: 'Dirección: '+this.listaGias[index].AreaDestino.Direccion, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'Codigo Predial: '+this.listaGias[index].AreaOrigen.CodPredial, style: 'tableHeader', alignment: 'left' }, { text: 'Codigo Predial: '+this.listaGias[index].AreaDestino.CodPredial, style: 'tableHeader', alignment: 'left' ,}],
            [{ text: 'CODIGO ÁREA: '+this.listaGias[index].AreaOrigen.Codigo, style: 'tableHeader', alignment: 'left' }, { text: 'CODIGO ÁREA: '+this.listaGias[index].AreaDestino.Codigo, style: 'tableHeader', alignment: 'left' ,}],

            [{ text: 'Datos del conductor ', style: 'tableHeader', alignment: 'center',fillColor:'blue',fillOpacity:0.60 }, { text: 'Ruta a Seguir', style: 'tableHeader', alignment: 'center' ,fillColor:'blue',fillOpacity:0.60}],
            [{text: 'CC/CI/RUC: '+this.listaGias[index].PersonaAutorizada.Cedula, style: 'tableHeader', alignment: 'left' }, { text: this.listaGias[index].Ruta, style: 'tableHeader', alignment: 'left' ,}],
            [{text: 'Nombre: '+this.listaGias[index].PersonaAutorizada.Nombres, style: 'tableHeader', alignment: 'left' }, { }],

            [{ text: 'Datos de vehiculo ', style: 'tableHeader', alignment: 'center',fillColor:'blue',fillOpacity:0.60 }, { text: 'Producto a Movilizar', style: 'tableHeader', alignment: 'center' ,fillColor:'blue',fillOpacity:0.60}],
            [{text: 'Medio Transporte: '+this.listaGias[index].Vehiculo.Tipo, style: 'tableHeader', alignment: 'left' }, { text:'Total: '+ this.listaGias[index].TotalProductos, style: 'tableHeader', alignment: 'left' ,}],
            [{text: 'Placa: '+this.listaGias[index].Vehiculo.Placa, style: 'tableHeader', alignment: 'left' }, { }],

            [{ text: 'Validez del Certificado', style: 'tableHeader', alignment: 'center' ,colSpan: 2,fillColor:'blue',fillOpacity:0.60}, {  }],
            [{ text: 'Fecha de emisión: '+this.listaGias[index].FechaEmision.date, style: 'tableHeader', alignment: 'left' ,colSpan: 2}, {  }],
            [{ text: 'Inicia: '+this.listaGias[index].FechaInicio.date, style: 'tableHeader', alignment: 'left' ,colSpan: 2}, {  }],
            [{ text: 'Finaliza: '+this.listaGias[index].FechaFinaliza.date, style: 'tableHeader', alignment: 'left' ,colSpan: 2}, {  }],
          ]
        }
      };
      jsonGias.push(aux);
      
    }


    const documentDefinition ={
      header: {

        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ '*', 'auto', '*' ],
  
          body: [
            [ {
              // in browser is supported loading images via url from reference by name in images
             // image: 'snow2',
             // fit: [50, 50],
             // margin:[20,30,0,0]
            },
             [
              {
              text:'Centro de Faenamiento N.T',
              fontSize: 11,
              bold: true,
              alignment: 'center',
              margin: [0, 30, 0, 0]},
              {
                text:'',
                fontSize: 11,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 0]
              
              },
              {
                text:'TUNGURAHU - TISALEO',
                fontSize: 9,
                bold: false,
                alignment: 'center',
                margin: [0, 0, 0, 0]
              
              },
              {
                text:'',
                fontSize: 9,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 0]
              
              }
            ]
            
            , {
              // in browser is supported loading images via url from reference by name in images
             // image: 'snow',
             // fit: [50, 50],
             // margin:[0,30,20,0]
            }],
           [
             {},
             {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 450, y2: 5, lineWidth: 3 ,lineColor: "#890000"}]},
             {}
           ]
          ]
        },
        layout: 'noBorders'
        ,
        


        
        
      },
      images: {
           
        // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
       // snow: '',
       // snow2:''
      },
      content: [
         ...jsonGias,

       
      ],
      styles: {
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        sNumeroR: {
          fontSize: 9,
          bold: false,
          alignment: 'left',
          margin: [0, 5, 0, 0]
        },
        sDirigido: {
          fontSize: 9,
          bold: false,
          alignment: 'left',
          margin: [0, 15, 0, 0]
        },
        sNEgrita: {
          fontSize: 9,
          bold: true,
          alignment: 'left',
          margin: [0, 0, 0, 0]
        },
        sNormal: {
          fontSize: 9,
          bold: false,
          alignment: 'left',
          margin: [0, 0, 0, 0]
        },
        sParrafo: {
          fontSize: 9,
          bold: false,
          alignment: 'justify',
          margin: [0, 15, 0, 0]
        },
        sSangria: {
          fontSize: 9,
          bold: false,
          alignment: 'justify',
          margin: [20, 15, 0, 0]
        },
        sAtentamente: {
          fontSize: 9,
          bold: false,
          alignment: 'justify',
          margin: [0, 30, 0, 0]
        },
        sCC: {
          fontSize: 7,
          bold: false,
          alignment: 'justify',
          margin: [0, 0, 0, 0]
        },
        
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: 'black'
        }
      },
      pageSize: 'A4',
      pageMargins: [80, 100, 80, 70],
    };

    (<any>pdfMake).createPdf(documentDefinition).open();

  }

}
