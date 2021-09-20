import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import {Usuario} from '../../modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { EncriptadoService } from 'src/app/servicios/encriptado.service';
import swal from 'sweetalert';
declare var $: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarioUso: Usuario={Apellidos:'', Cedula:'',Estado:'', FechaCreacion:{date:''},IdPerfil:'',IdUsuario:'',Imagen:'',NombrePerfil:'',Nombres:'',token:'',};
  usuarioSelec: Usuario={Apellidos:'', Cedula:'',Estado:'', FechaCreacion:{date:''},IdPerfil:'',IdUsuario:'',Imagen:'',NombrePerfil:'',Nombres:'',token:'',};
  listaUsuarios:any=[];
  listaUsuariosAux:any=[];
  listaPerfiles:any=[];
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,public router: Router,private encriSer: EncriptadoService
  ,private usrSer:UsuariosService) { }

  ngOnInit(): void {
    this.cargarUsuarioUso();
    this.lisataUsuarios();
    this.cargarlistaPerfiles();

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
  cargarlistaPerfiles(){
    this.usrSer.getPerfiles( this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        
          if (res.estado) {
            var guias = this.encriSer.desencriptar(res.res, false);
  
            console.log(guias);
            this.listaPerfiles = guias;
            
  
          }else{
            this.listaPerfiles = [];
            
          }

        
      },
      err => {

        console.log(err);
      }
    );
  }
  lisataUsuarios(){
    this.usrSer.getUsuarios( this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          if (res.estado) {
            var guias = this.encriSer.desencriptar(res.res, false);
  
            console.log(guias);
            this.listaUsuarios = guias;
            this.listaUsuariosAux = guias;
  
          }else{
            this.listaUsuarios = [];
            this.listaUsuariosAux = [];
          }

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  busquedaUsuarios(ev: any){
    this.listaUsuarios = this.listaUsuariosAux;

    let value = (<HTMLInputElement>ev.target).value;
    //console.log('value', value);
    if (value != "") {
      const result = this.listaUsuarios.filter((user: Usuario) => user.Nombres.search(value) >= 0

        || user.Apellidos.toUpperCase().search(value.toUpperCase()) >= 0
        || user.Cedula.toUpperCase().search(value.toUpperCase()) >= 0
        || user.FechaCreacion.date.toUpperCase().search(value.toUpperCase()) >= 0
        );
      this.listaUsuarios = result;
    } else {
      this.listaUsuarios = this.listaUsuariosAux;
    }
  }
  cklActualizar(usuario:Usuario){
    this.usuarioSelec=usuario;
    $('#ModalUsuario').modal('show');
  }
  clickEliminar(usuario:Usuario){
    swal({
      title: "Seguro que deseas eliminar el usuario",
      
      icon: "warning",
      buttons: ['Cancelar','OK'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        
        this.usrSer.DeleteUsuario(usuario.IdUsuario,this.usuarioUso.token).subscribe(
          async res => {
            console.log(res);
            if(res.estado){
              swal(res.mensaje, {
                icon: "success",
              });
              this.lisataUsuarios();
             
            }else{
              swal(res.mensaje, {
                icon: "warning",
              });
            }
    
          },
          err => {
            console.log('err',err);
            swal("Error al Eliminar Usuario", {
              icon: "warning",
            });

            
            
          }
        );



        
      }
    });
  }
 //imagen
 base64textStringG = '';
 onUploadChange(evt: any) {
   const file = evt.target.files[0];

   if (file) {
     const reader = new FileReader();

     reader.onload = this.handleReaderLoaded.bind(this);
     reader.readAsBinaryString(file);
   }
 }

 handleReaderLoaded(e:any) {
   this.base64textStringG = 'data:image/jpg;base64,' + btoa(e.target.result);
   //console.log(this.base64textStringG);
   this.usuarioSelec.Imagen=this.base64textStringG;
 }
 clkGuardar(){
   var TxtCedula=(<HTMLInputElement>document.getElementById('txtCedula')).value;
   var TxtNombre=(<HTMLInputElement>document.getElementById('txtNombres')).value;
   var TxtApellidos=(<HTMLInputElement>document.getElementById('txtApellidos')).value;
   var TxtContraseña=(<HTMLInputElement>document.getElementById('txtContraseña')).value;
   var perfilid=Number.parseInt( (<HTMLSelectElement>document.getElementById('SelectPerfil')).value);
   var usrAct={
     IdUsuario:this.usuarioSelec.IdUsuario,
     Cedula:TxtCedula,
     Nombres:TxtNombre,
     Apellidos:TxtApellidos,
     Contrasena:TxtContraseña,
     IdPerfil:perfilid,
     img:this.usuarioSelec.Imagen
   }

   if(this.validaruUsr(usrAct)){
     swal({
       title: "Seguro que deseas actualizar la informacion",
       
       icon: "warning",
       buttons: ['Cancelar','OK'],
       dangerMode: true,
     })
     .then((willDelete) => {
       if (willDelete) {
         this.usrSer.actualizarUsuario(usrAct,this.usuarioUso.token).subscribe(
           async res => {
             console.log(res);
             if(res.estado){
               swal(res.mensaje, {
                 icon: "success",
               });
               this.lisataUsuarios();
               (<HTMLInputElement>document.getElementById('txtContraseña')).value='';
               $('#ModalUsuario').modal('hide');
             }else{
               swal(res.mensaje, {
                 icon: "warning",
               });
             }
     
           },
           err => {
             console.log('err',err);
             swal("Error al Actualisar Usuario", {
               icon: "warning",
             });

             
             
           }
         );



         
       }
     });
   }


 }

 validaruUsr(usr:any){
   console.log(usr);
   if(usr.Cedula.length != 10){
     this.mesajeError('Ingrese una cedula valida')
     return false;
   }
   if(usr.Nombres.length ==0){
     this.mesajeError('Ingrese un Nombre')
     return false;
   }
   if(usr.Apellidos.length==0){
     this.mesajeError('Ingrese un Apellido')
     return false;
   }
   return true;
 }
 mesajeError(texto:string){
   swal({
     title: "Error!",
     text: texto,
     icon: "warning",
     
   });
 }
 clkRedNew(){
   this.usuarioSelec={Apellidos:'', Cedula:'',Estado:'', FechaCreacion:{date:''},IdPerfil:'',IdUsuario:'',Imagen:'',NombrePerfil:'',Nombres:'',token:'',};
  $('#ModalUsuarioNew').modal('show');
 }
 clkGuardarNewUser(){
  var TxtCedula=(<HTMLInputElement>document.getElementById('txtCedulaNew')).value;
   var TxtNombre=(<HTMLInputElement>document.getElementById('txtNombresNew')).value;
   var TxtApellidos=(<HTMLInputElement>document.getElementById('txtApellidosNew')).value;
   var TxtContraseña=(<HTMLInputElement>document.getElementById('txtContraseñaNew')).value;
   var TxtConfirmarContraseña=(<HTMLInputElement>document.getElementById('txtConfirmarContraseñaNew')).value;
   var perfilid=Number.parseInt( (<HTMLSelectElement>document.getElementById('SelectPerfilNew')).value);
   var usrAct={
     IdUsuario:this.usuarioUso.IdUsuario,
     Cedula:TxtCedula,
     Nombres:TxtNombre,
     Apellidos:TxtApellidos,
     Contrasena:TxtContraseña,
     IdPerfil:perfilid,
     img:this.usuarioSelec.Imagen
   }
   if(usrAct.Contrasena==TxtConfirmarContraseña ){
      if(this.validaruUsr(usrAct)){
        this.usrSer.newUsuario(usrAct,this.usuarioUso.token).subscribe(
          async res => {
            console.log(res);
            if(res.estado){
              swal(res.mensaje, {
                icon: "success",
              });
              this.lisataUsuarios();
              (<HTMLInputElement>document.getElementById('txtContraseñaNew')).value='';
              (<HTMLInputElement>document.getElementById('txtConfirmarContraseñaNew')).value='';
              $('#ModalUsuarioNew').modal('hide');
            }else{
              swal(res.mensaje, {
                icon: "warning",
              });
            }
    
          },
          err => {
            console.log('err',err);
            swal("Error al Actualisar Usuario", {
              icon: "warning",
            });

            
            
          }
        );

      }
   }else{
    this.mesajeError('Las contraseñas no coinciden')
   }
 }

}
