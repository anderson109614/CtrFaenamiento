import { Component, ViewChild, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { NgQrScannerModule, QrScannerComponent } from 'angular2-qrscanner';
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
import { UsuariosService } from 'src/app/servicios/usuarios.service';
declare var $: any;
@Component({
    selector: 'app-newguia',
    templateUrl: './newguia.component.html',
    styleUrls: ['./newguia.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class NewguiaComponent implements OnInit {
    CSMI_No: string = '';
    AUTORIZADO_A: string = '';
    CODIGO_AREA_ORIGEN: string = '';
    CODIGO_AREA_DESTINO: string = '';
    TOTAL_PRODUCTOS: number = 0;
    VALIDO_HASTA_fecha: string = '';
    VALIDO_HASTA_Hora: string = '';
    VEHICULO: string = '';
    usuarioUso: any = {};
    personaUso: Persona = { IdPersona: '', Cedula: '', Nombres: '' };
    areaDestino: Area = { IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
    areaOrigen: Area = { IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
    vehiculouso: Vehiculo = { IdVehiculo: '', IdPersonaPer: '', Placa: '', Tipo: '' }
    listaDetalles: Detalle[] = [];
    valtotalLista:number=0;
    constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router, private guiasSer: GuiasService, private encriSer: EncriptadoService
    ,private usrSer:UsuariosService) {

    }
    @ViewChild(QrScannerComponent, { static: false }) qrScannerComponent!: QrScannerComponent;

    ngOnInit() {
        this.cargarUsuarioUso();
       
    }

    ngAfterViewInit(): void {


    }
    cargarUsuarioUso() {
        var us = this.storage.get('Usuario');
        this.usuarioUso = us;
        this.usrSer.verificarPermisos(this.usuarioUso.IdPerfil,'newguia', this.usuarioUso.token).subscribe(
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
    inicaiarCamara() {
        $('#ModalQR').modal('show');

        this.qrScannerComponent.getMediaDevices().then(devices => {
            console.log(devices);
            const videoDevices: MediaDeviceInfo[] = [];
            for (const device of devices) {
                if (device.kind.toString() === 'videoinput') {
                    videoDevices.push(device);
                }
            }
            if (videoDevices.length > 0) {
                let choosenDev;
                for (const dev of videoDevices) {
                    if (dev.label.includes('front')) {
                        choosenDev = dev;
                        break;
                    }
                }
                if (choosenDev) {
                    this.qrScannerComponent.chooseCamera.next(choosenDev);
                } else {
                    this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
                }
            }
        });

        this.qrScannerComponent.capturedQr.subscribe((result: any) => {
            console.log(result);
            this.cargarInformacion(result);
            $('#ModalQR').modal('hide')

        });

    }
    pararCamara() {
        this.qrScannerComponent.stopScanning();
    }
    async cargarInformacion(escaneoQR: string) {
        /*  CZPM Nº: 2021-09-5947832289  
AUTORIZADO A: 1803079027  
CODIGÓ ÁREA ORIGEN: 24-0180-01177-00286284  
CODIGÓ ÁREA DESTINO: 24-0180%01177-00160292  
TOTAL PRODUCTOS: 2  
VALIDO HASTA: 2021-09-15 17:36:00  
VEHICULO: 
*/
        var separado = escaneoQR.split('\n');
        console.log(separado);
        
        var datos = [];
        for (let index = 0; index < separado.length; index++) {
            datos.push(separado[index].split(':')[1].replace(/ /g, ""))


        }
        console.log(datos);
       
        this.CSMI_No = datos[0];
        this.AUTORIZADO_A = datos[1];
        this.CODIGO_AREA_ORIGEN = datos[2];
        this.CODIGO_AREA_DESTINO = datos[3];
        this.TOTAL_PRODUCTOS = Number.parseInt(datos[4]);
        /**/
        var fechaAux=separado[5].split(' ');
        var fecha=fechaAux[2];
        this.VALIDO_HASTA_fecha = fecha;
        var sep = this.VALIDO_HASTA_fecha.split('/');
        console.log('sep',sep);
        //this.VALIDO_HASTA_fecha = sep[2] + "-" + sep[1] + "-" + sep[0];
        this.VALIDO_HASTA_Hora=fechaAux[3];
        console.log('fechHora',this.VALIDO_HASTA_Hora,this.VALIDO_HASTA_fecha);


        /*
        this.VALIDO_HASTA_fecha = separado[5];
        var sep = this.VALIDO_HASTA_fecha.split('/');
        this.VALIDO_HASTA_fecha = sep[2] + "-" + sep[1] + "-" + sep[0];
        console.log(this.VALIDO_HASTA_fecha)
        this.VALIDO_HASTA_Hora = datos[6];
        */
        /**/
        this.VEHICULO = datos[7];
        this.activarParpadeos();
        (<HTMLButtonElement>document.getElementById('btnGuardar')).disabled=false;
        (<HTMLButtonElement>document.getElementById('btnLimpiar')).disabled=false;
        
        await this.cargarVehiculo();
        await this.cargarOrigen();
        await this.cargarDestino();
        await this.cargarPersona();
        
         /*
*/

    }
    cargarPersona() {
        this.guiasSer.getPersona(this.AUTORIZADO_A, this.usuarioUso.token).subscribe(
            res => {
                if (res.estado) {
                    var usrs = this.encriSer.desencriptar(res.res, false);
                    console.log(usrs);
                    this.personaUso.IdPersona = usrs[0].IdPersona;
                    this.personaUso.Cedula = usrs[0].Cedula;
                    this.personaUso.Nombres = usrs[0].Nombres;
                    (<HTMLDivElement>document.getElementById('divAutorizadoPar')).style.display="none";
                } else {
                    $('#ModalNuevaPersona').modal('show');
                }
            },
            err => {

                console.log(err)
            }
        );
    }
    cargarVehiculo() {
        
       if(this.VEHICULO!=undefined){
    
      
            this.guiasSer.getVehiculo(this.VEHICULO, this.usuarioUso.token).subscribe(
                res => {
                    if (res.estado) {
                        var usrs = this.encriSer.desencriptar(res.res, false);
                        console.log(usrs);
                        this.vehiculouso.IdVehiculo = usrs[0].IdVehiculo;
                        this.vehiculouso.Placa = usrs[0].Placa;
                        this.vehiculouso.Tipo = usrs[0].Tipo;
                        this.vehiculouso.IdPersonaPer = usrs[0].IdPersonaPer;
                        (<HTMLDivElement>document.getElementById('divVehiculoPar')).style.display="none";
                    } else {
                        $('#ModalNuevoVehiculo').modal('show');
                    }
                },
                err => {
    
                    console.log(err)
                }
            );
        
        }else{
            (<HTMLDivElement>document.getElementById('divVehiculoPar')).style.display="none";
            this.VEHICULO='';
        }
    }
    GuardarVehiculo() {

        let vehi: Vehiculo = {
            IdVehiculo: '',
            Placa: (<HTMLInputElement>document.getElementById('txtPlacaNew')).value,
            Tipo: (<HTMLInputElement>document.getElementById('txtTipoNew')).value,
            IdPersonaPer: this.personaUso.IdPersona
        }
        if (vehi.Tipo.length > 0) {
            this.guiasSer.guardarVehiculo(vehi, this.usuarioUso.token).subscribe(
                res => {
                    console.log(res);
                    if (res.estado) {
                        var vehiculoREs = this.encriSer.desencriptar(res.res, false);
                        vehi.IdVehiculo = vehiculoREs;
                        this.vehiculouso = vehi;
                        $('#ModalNuevoVehiculo').modal('hide');
                        (<HTMLDivElement>document.getElementById('divVehiculoPar')).style.display="none";
       
                    } else {
                        this.mesajeError('Error al guardar');
                    }
                },
                err => {

                    console.log(err);
                    this.mesajeError('Error al guardar');
                }
            );
        } else {
            this.mesajeError('Ingrese nombre de medio de transporte');
        }

    }
    GuardarPersona() {
        var ci = (<HTMLInputElement>document.getElementById('txtCInewPwesona')).value;;
        var nombre = (<HTMLInputElement>document.getElementById('txtNombreNewPersona')).value;
        if (nombre.length > 0) {
            this.guiasSer.guardarPersona(ci, nombre, this.usuarioUso.token).subscribe(
                res => {
                    console.log(res);
                    if (res.estado) {
                        var Idusr = this.encriSer.desencriptar(res.res, false);
                        this.personaUso.IdPersona = Idusr;
                        this.personaUso.Cedula = ci;
                        this.personaUso.Nombres = nombre;
                        $('#ModalNuevaPersona').modal('hide');
                        
                        (<HTMLDivElement>document.getElementById('divAutorizadoPar')).style.display="none";
                    } else {
                        this.mesajeError('Error al guardar');
                    }
                },
                err => {

                    console.log(err);
                    this.mesajeError('Error al guardar');
                }
            );
        } else {
            this.mesajeError('Ingrese un nombre');
        }


    }
    cargarOrigen() {
        this.guiasSer.getArea(this.CODIGO_AREA_ORIGEN, this.usuarioUso.token).subscribe(
            res => {
                console.log(res);
                if (res.estado) {
                    var area = this.encriSer.desencriptar(res.res, false);
                    console.log(area);
                    this.areaOrigen.IdArea = area[0].IdArea;
                    this.areaOrigen.Canton = area[0].Canton;
                    this.areaOrigen.Codigo = area[0].Codigo;
                    this.areaOrigen.Descripcion = area[0].Descripcion;
                    this.areaOrigen.Direccion = area[0].Direccion;
                    this.areaOrigen.Parroquia = area[0].Parroquia;
                    this.areaOrigen.Provincia = area[0].Provincia;
                    this.areaOrigen.CodPredial = area[0].CodPredial;
                    this.areaOrigen.IdPropietario=area[0].IdPropietario;
                    this.areaOrigen.Propietario=area[0].Propietario;
                    (<HTMLDivElement>document.getElementById('divOrigenPar')).style.display="none";
       
                } else {
                    $('#ModalNuevaArea').modal('show');
                }
            },
            err => {

                console.log(err)
            }
        );
    }
    cargarDestino() {
        this.guiasSer.getArea(this.CODIGO_AREA_DESTINO, this.usuarioUso.token).subscribe(
            res => {
                console.log('Destino',res);
                if (res.estado) {
                    var area = this.encriSer.desencriptar(res.res, false);
                    console.log(area);
                    this.areaDestino.IdArea = area[0].IdArea;
                    this.areaDestino.Canton = area[0].Canton;
                    this.areaDestino.Codigo = area[0].Codigo;
                    this.areaDestino.Descripcion = area[0].Descripcion;
                    this.areaDestino.Direccion = area[0].Direccion;
                    this.areaDestino.Parroquia = area[0].Parroquia;
                    this.areaDestino.Provincia = area[0].Provincia;
                    this.areaDestino.CodPredial = area[0].CodPredial;
                    this.areaDestino.IdPropietario=area[0].IdPropietario;
                    this.areaDestino.Propietario=area[0].Propietario;
                } else {
                    $('#ModalNuevaArea').modal('show');
                }
            },
            err => {

                console.log(err)
            }
        );
    }
    GuardarArea() {
        let area: Area = {
            IdArea: '',
            Canton: (<HTMLInputElement>document.getElementById('txtCantonNew')).value,
            Provincia: (<HTMLInputElement>document.getElementById('txtProvinciaNew')).value,
            Parroquia: (<HTMLInputElement>document.getElementById('txtParroquiaNew')).value,
            Codigo: (<HTMLInputElement>document.getElementById('txtCodigoNew')).value,
            CodPredial:(<HTMLInputElement>document.getElementById('txtCodPredialNew')).value,
            Descripcion:(<HTMLInputElement>document.getElementById('txtDescripcionNew')).value,
            Direccion:(<HTMLInputElement>document.getElementById('txtDireccionNew')).value,
            IdPropietario:this.personaUso.IdPersona,
            Propietario:{Cedula:'',IdPersona:'',Nombres:'',}
        }
        console.log(area);
        if (this.validarArea(area)) {

            this.guiasSer.guardarArea(area, this.usuarioUso.token).subscribe(
                res => {
                    console.log(res);
                    if (res.estado) {
                        var Idarea = this.encriSer.desencriptar(res.res, false);
                        area.IdArea = Idarea;
                        area.Propietario=this.personaUso;
                        this.areaOrigen = area;
                        $('#ModalNuevaArea').modal('hide');
                        
                        (<HTMLDivElement>document.getElementById('divOrigenPar')).style.display="none";
      
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
    ChangeFechaEmicion() {
        // console.log(percent);
        (<HTMLInputElement>document.getElementById('txtFechaInicia')).value = (<HTMLInputElement>document.getElementById('txtFechaEmicion')).value;

    }
    ChangeHoraEmicion() {
        // console.log(percent);
        (<HTMLInputElement>document.getElementById('txtHoraInia')).value = (<HTMLInputElement>document.getElementById('txtHoraEmicion')).value;

    }
    ChangeCantidad() {
     
      var txtCantidad = (<HTMLInputElement>document.getElementById('txtCantidadDetalle'));
      //console.log(txtCantidad.value,"asd");
      if(txtCantidad.value.length==0){
        txtCantidad.value="1";
      }
      if(Number.parseInt(txtCantidad.value)<=0){
        txtCantidad.value="1";
      }

    }
    activarParpadeos(){
       (<HTMLDivElement>document.getElementById('divVehiculoPar')).style.display="block";
       (<HTMLDivElement>document.getElementById('divOrigenPar')).style.display="block";
       (<HTMLDivElement>document.getElementById('divAutorizadoPar')).style.display="block";

    }
    AnadirDetalle() {
        let det: Detalle = {
            Producto: (<HTMLInputElement>document.getElementById('txtNombreDetalle')).value,
            Cantidad: Number.parseInt((<HTMLInputElement>document.getElementById('txtCantidadDetalle')).value)
        };
        console.log(det);
        
        this.valtotalLista = this.totalLista();
        
        var diferencia = this.TOTAL_PRODUCTOS - this.valtotalLista;
        
        if (diferencia >= det.Cantidad) {
            var aux=true;
            for (let index = 0; index < this.listaDetalles.length; index++) {
                if(this.listaDetalles[index].Producto.toLowerCase()==det.Producto.toLowerCase()){
                    this.listaDetalles[index].Cantidad+=det.Cantidad;
                    aux=false;
                }
            }
            if(aux){
                this.listaDetalles.push(det);
            }
            this.valtotalLista = this.totalLista();
            $('#ModalAñadirDetalle').modal('hide');
        } else {
            this.mesajeError('Cantidad Superada');
        }

    }
    totalLista(): number {
        var tot = 0;
        for (let index = 0; index < this.listaDetalles.length; index++) {
            tot += this.listaDetalles[index].Cantidad;

        }

        return tot;
    }
    EliminarDetalle(i:number){
        console.log(i);
        this.listaDetalles.splice(i,1);

    }
    clkLimpiar(){
      var listaImput=  document.getElementsByClassName('form-control');
      for (let index = 0; index < listaImput.length; index++) {
          (<HTMLInputElement>listaImput[index]).value="";
          (<HTMLInputElement>listaImput[index]).classList.remove('is-invalid');
          (<HTMLInputElement>listaImput[index]).classList.remove('is-valid');
      }
      this.personaUso= { IdPersona: '', Cedula: '', Nombres: '' };
      this.areaDestino = { IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
      this.areaOrigen = { IdArea: '', Canton: '', Codigo: '', Descripcion: '',  Parroquia: '', Provincia: '', CodPredial:'',Direccion:'',IdPropietario:'',Propietario:{Cedula:'',IdPersona:'',Nombres:''} };
      this.vehiculouso = { IdVehiculo: '', IdPersonaPer: '', Placa: '', Tipo: '' }
      this.listaDetalles = [];
      this.CSMI_No = '';
      this.AUTORIZADO_A = '';
      this.CODIGO_AREA_ORIGEN = '';
      this.CODIGO_AREA_DESTINO = '';
      this.TOTAL_PRODUCTOS = 0;
      this.VALIDO_HASTA_fecha = '';
      this.VALIDO_HASTA_Hora = '';
      this.VEHICULO = '';
      (<HTMLButtonElement>document.getElementById('btnGuardar')).disabled=true;
        (<HTMLButtonElement>document.getElementById('btnLimpiar')).disabled=true;
    }
    validarGuardado(){
            var ret=true;
            var listaImput=  document.getElementsByClassName('form-control required');
            for (let index = 0; index < listaImput.length; index++) {
                if(!(<HTMLInputElement>listaImput[index]).disabled && (<HTMLInputElement>listaImput[index]).value.length==0){
                    (<HTMLInputElement>listaImput[index]).classList.add('is-invalid');
                    ret=false;
                }
                
            }
            if(this.personaUso.IdPersona.length==0){
                
                this.mesajeError('Persona no ingresada...!!');
                return false;
                
            }
            if(this.areaDestino.IdArea.length==0){
                this.mesajeError('Area de destino no ingresadsa...!!');
                return false;
            }
            if(this.vehiculouso.IdVehiculo.length==0){
                if(this.VEHICULO.length>0){
                    this.mesajeError('Vehiculo no ingresado...!!');
                    return false;
                }else{
                    this.vehiculouso.IdVehiculo='2';
                }
                
            }
            if(this.listaDetalles.length==0){
                this.mesajeError('Detalles incompletos...!!');
                return false;
            }
            if(this.TOTAL_PRODUCTOS!=this.valtotalLista){
                console.log('total',this.TOTAL_PRODUCTOS,this.valtotalLista);
                this.mesajeError('Cantidad de productos inconsistente...!!');
                return false;
            }
            if(ret){

                return ret;
            }else{
                this.mesajeError('Datos Incompletos...!!');
                return ret;
            }
            
    }
    clkGuardar(){
       if(this.validarGuardado()){
            let guia:Guia={
                IdGia:'',
                Numero:(<HTMLInputElement>document.getElementById('txtNumeroEmicion')).value,
                FechaEmision:{date: (<HTMLInputElement>document.getElementById('txtFechaEmicion')).value+' '+(<HTMLInputElement>document.getElementById('txtHoraEmicion')).value} ,
                FechaFinaliza:{date:this.VALIDO_HASTA_fecha+' '+this.VALIDO_HASTA_Hora}  ,
                FechaInicio: {date:(<HTMLInputElement>document.getElementById('txtFechaInicia')).value+' '+(<HTMLInputElement>document.getElementById('txtHoraInia')).value} ,
                AreaDestino:this.areaDestino,
                AreaOrigen:this.areaOrigen,
                PersonaAutorizada:this.personaUso,
                Vehiculo:this.vehiculouso,
                LugarOrigen:'',
                Ruta:(<HTMLInputElement>document.getElementById('txtRuta')).value,
                TipoEmision:(<HTMLInputElement>document.getElementById('txtTipoEmicion')).value,
                TotalProductos:this.TOTAL_PRODUCTOS,
                listaDetalles:this.listaDetalles,
                Usuario:this.usuarioUso

            };
            this.guiasSer.guardarGuia(guia, this.usuarioUso.token).subscribe(
                res => {
                    console.log(res);
                    if (res.estado) {
                        var re = this.encriSer.desencriptar(res.res, false);
                        console.log(re);
                        this.clkLimpiar();
                       
           
                    }else{
                        this.mesajeError('Error al guardar informacion...!!');
                    }
                },
                err => {
    
                    console.log(err)
                }
            );
            


       }

    }
    changeValid(){
        var listaImput=  document.getElementsByClassName('form-control required');
        for (let index = 0; index < listaImput.length; index++) {
            if(!(<HTMLInputElement>listaImput[index]).disabled && (<HTMLInputElement>listaImput[index]).value.length!=0){
                (<HTMLInputElement>listaImput[index]).classList.remove('is-invalid');
                (<HTMLInputElement>listaImput[index]).classList.add('is-valid');
                
            }else{
                (<HTMLInputElement>listaImput[index]).classList.remove('is-valid');
                (<HTMLInputElement>listaImput[index]).classList.add('is-invalid');
            }
            
        } 
    }

}


